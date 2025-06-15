import Queue from "bee-queue";
import { logger } from "../../logger/logger";
import { IBaseTask } from "../constants";

export function handleBulkContactEdit(
  job: Queue.Job<IBaseTask<any>>,
): Promise<any> {
  return new Promise((res, rej) => {
    logger.warn(
      `Processing New Task In ${job.queue.name} with Job Id: ${job.id}!!`,
    );

    logger.info("Job Payload:");
    logger.info(JSON.stringify(job.data.payload, null, 2));

    res({ success: true });
  });
}
