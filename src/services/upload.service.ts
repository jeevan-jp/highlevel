import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../logger/logger";
import { BUCKET_NAME, s3Client } from "../utils/awsS3";

class UploadServiceClass {
  public static get(): UploadServiceClass {
    return this.instance || new UploadServiceClass();
  }
  private static readonly instance: UploadServiceClass;

  public async initiateMultipartUpload(
    fileName: string,
    fileType: string,
  ): Promise<{ uploadId: string; key: string }> {
    try {
      // Use a unique key for the file to prevent overwrites.
      const key = `hl-staging/uploads/${Date.now()}-${fileName}`;

      logger.warn(`Key: ${key}`);

      const command = new CreateMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType,
      });
      const { UploadId, Key } = await s3Client.send(command);

      if (!UploadId || !Key) {
        throw new Error("Empty response from s3!");
      }

      logger.info(`UploadId: ${UploadId}; Key: ${Key}`);
      return {
        uploadId: UploadId,
        key: Key,
      };
    } catch (error) {
      logger.error("Error initiating multipart upload:", error);
      throw error;
    }
  }

  public async getPresignedUrl(
    key: string,
    uploadId: string,
    partNumber: number,
  ) {
    try {
      const command = new UploadPartCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      });

      // pre-signed URL will valid for a limited time (e.g., 15 minutes)
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60 * 15,
      });

      return presignedUrl;
    } catch (error) {
      logger.error(
        `Error generating pre-signed URL for part ${partNumber}:`,
        error,
      );
      throw new Error("Failed to generate pre-signed URL.");
    }
  }

  public async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: Array<{ PartNumber: number; ETag: string }>,
  ) {
    try {
      const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

      const command = new CompleteMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: sortedParts,
        },
      });
      const response = await s3Client.send(command);
      return {
        location: response.Location, // The full URL of the final uploaded file
        message: "Upload completed successfully!",
      };
    } catch (error) {
      logger.error("Error completing multipart upload:", error);
      // If completion fails, we should try to abort the upload to avoid orphaned parts.
      const command_abort = new AbortMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
      });
      try {
        await s3Client.send(command_abort);
        logger.info(`Successfully aborted multipart upload ${uploadId}`);
      } catch (abortError) {
        logger.error(
          `Failed to abort multipart upload ${uploadId}:`,
          abortError,
        );
      }

      throw new Error(
        "Failed to complete upload. The upload has been aborted.",
      );
    }
  }
}

const UploadService = UploadServiceClass.get();
export default UploadService;
