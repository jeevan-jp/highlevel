import { GetObjectCommand } from "@aws-sdk/client-s3";
import Queue from "bee-queue";
import csv from "csv-parser";
import { getRepository, QueryRunner } from "typeorm";

import { logger } from "../../logger/logger";
import { getTransactionQueryRunner } from "../../typeorm/config/utils";
import { BulkActions } from "../../typeorm/entities/bulkActions";
import { Contacts } from "../../typeorm/entities/contacts";
import { IBulkActionStats } from "../../types/actions";
import { s3Client } from "../../utils/awsS3";
import { EBulkActionStatus } from "../../utils/enums";
import { IBaseTask } from "../constants";

/**
 * Key features:
 * 1. Streams csv file from s3
 * 1. Divides stream into chunks of specified size(BATCH_SIZE);
 * 2. keeps track of last chunk id in db, to pick where it was left at
 * 3. fault tolerance: skips chunks which were already processed
 * 4. maintains stats, errors etc.
 */
export async function handleBulkContactEdit(
  job: Queue.Job<IBaseTask<any>>,
): Promise<any> {
  const errors: any[] = [];
  const stats: IBulkActionStats = {
    totalRows: 0,
    successfulUpserts: 0,
    failedUpserts: 0,
    skippedRows: 0,
    startTime: new Date().toISOString(),
    endTime: null,
  };

  const bulkActionRepo = getRepository(BulkActions);
  let batch: any[] = [];
  const { s3Key, bulkActionId } = job.data.payload;
  logger.info(`payload: ${JSON.stringify(job.data.payload, null, 2)}`);

  try {
    logger.warn(`:::: PROCESSING JOB ID: ${job.id} ::::`);
    let lastChunkProcessed = 0;

    const existingAction = await bulkActionRepo.findOne(bulkActionId, {
      select: ["lastSuccessfulChunkIndex"],
    });
    if (existingAction) {
      lastChunkProcessed = Number(existingAction.lastSuccessfulChunkIndex);
    }

    // 1. update task status to processing
    await bulkActionRepo.update(bulkActionId, {
      status: EBulkActionStatus.PROCESSING,
    });

    // 2. Get the file stream from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: s3Key,
    });

    const s3Response = await s3Client.send(getObjectCommand);

    const fileStream = s3Response.Body as NodeJS.ReadableStream; // This is a readable stream

    if (!fileStream) {
      throw new Error(`empty file: ${s3Key}`);
    }

    const queryRunner = await getTransactionQueryRunner();
    let currentBatch = 1;

    // 3. Process the stream row-by-row
    await new Promise((resolve, reject) => {
      const parser = fileStream.pipe(csv());
      parser.on("data", async (row: Contacts) => {
        stats.totalRows++;
        batch.push(row);

        // in case batch is full
        if (batch.length === Number(process.env.BATCH_SIZE)) {
          parser.pause();
          // skip already processed one
          if (currentBatch <= lastChunkProcessed) {
            logger.warn(`Skipping chunk id: ${currentBatch}`);
            stats.skippedRows = Number(stats.skippedRows) + batch.length;
          } else {
            // process new batch
            logger.info(`Picked chunk id: ${currentBatch}`);
            await processBatch(batch, stats, errors, queryRunner);

            // update lastSuccessfulChunkIndex
            bulkActionRepo.update(bulkActionId, {
              lastSuccessfulChunkIndex: currentBatch,
            });
          }

          currentBatch++;

          // cleanup
          batch = [];
          parser.resume();
        }
      });

      parser.on("end", async () => {
        // wait for the last transaction to finish
        while (queryRunner.isTransactionActive) {
          logger.info("waiting for last batch to finish");
          await new Promise((res, rej) => {
            setTimeout(res, 1000); // 1sec wait timeout
          });
        }

        // process partial batch
        if (batch.length > 0) {
          await processBatch(batch, stats, errors, queryRunner);
        }

        logger.info(`Finished CSV file processing for job id: ${job.id}.`);
        resolve(1);
      });

      parser.on("error", async (err) => {
        logger.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!");
        logger.error(err);
        queryRunner.release();
        reject(err);
      });
    });

    stats.endTime = new Date().toISOString();

    await bulkActionRepo.update(bulkActionId, {
      status: EBulkActionStatus.SUCCESS,
      stats,
      errors,
      completedAt: stats.endTime,
    });

    return stats;
  } catch (error: any) {
    logger.error(error);
    stats.endTime = new Date().toISOString();
    errors.push({ generalError: error.message, stack: error.stack });

    await bulkActionRepo.update(bulkActionId, {
      status: EBulkActionStatus.FAILURE,
      completedAt: stats.endTime,
      stats,
      errors,
    });

    logger.error(`Job ${job.id} failed unexpectedly:`, error);

    // Advanced: Re-throw to let Bee-Queue know it failed, push task to Dead Letter Queue(DLQ)
    throw error;
  }
}

async function processBatch(
  batch: Contacts[],
  stats: any,
  errors: any[],
  queryRunner: QueryRunner,
) {
  let localSuccess = 0;
  let localFails = 0;
  let localSkips = 0;
  logger.info(`Batch size: ${batch.length}`);

  try {
    await queryRunner.startTransaction();
    const t1 = Date.now();

    for (const row of batch) {
      if (!row.email || !row.name || !row.phone) {
        localSkips++;
        errors.push({
          row: localSuccess + localFails + localSkips,
          error: "Missing required fields",
          data: row,
        });
        continue;
      }

      const contactsRepo = queryRunner.manager.getRepository(Contacts);
      try {
        await contactsRepo.insert({
          name: row.name,
          email: row.email,
          phone: row.phone,
        });

        // await makRawQuery(
        //   `insert into contacts ('name', 'email', 'phone') values (?, ?, ?)`,
        //   [row.name, row.email, row.phone],
        // );
      } catch (upsertErr) {
        await contactsRepo.update(
          { email: row.email },
          { name: row.name, phone: row.phone },
        );
      } finally {
        localSuccess++;
      }
    }

    // If all operations were successful, commit the transaction
    await queryRunner.commitTransaction();
    logger.warn(`Batch processed in ${Date.now() - t1}ms ✅`);
    logger.info(
      `::::TRANSACTION COMMITTED! ✅: ${localSuccess}; ❎: ${localFails} ::::`,
    );
  } catch (err: any) {
    // If any operation fails, roll back the entire transaction
    logger.error(err);
    await queryRunner.rollbackTransaction();
    localFails = batch.length - localSkips; // The whole batch failed
    localSuccess = 0;
    errors.push({ batch_error: err.message, failed_rows: localFails });
  } finally {
    // Update global stats
    stats.successfulUpserts += localSuccess;
    stats.failedUpserts += localFails;
    stats.skippedRows += localSkips;
  }
}
