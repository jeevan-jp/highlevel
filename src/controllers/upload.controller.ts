import { StatusCodes } from "http-status-codes";
import { logger } from "../logger/logger";
import UploadService from "../services/upload.service";

class UploadControllerClass {
  public static get(): UploadControllerClass {
    return this.instance || new UploadControllerClass();
  }

  private static readonly instance: UploadControllerClass;

  public async initiateMultipartUpload(req: any, res: any) {
    try {
      const { fileName, fileType } = req.body;
      if (!fileName || !fileType) {
        throw new Error("fileName and fileType are required");
      }

      const data = await UploadService.initiateMultipartUpload(
        fileName,
        fileType,
      );

      res.json({ success: true, data });
    } catch (err) {
      logger.error(err);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Failed to initate multipart upload. Please retry!",
      });
    }
  }

  public async getPresignedUrl(req: any, res: any) {
    try {
      const { key, uploadId, partNumber } = req.body;
      if (!key || !uploadId || !partNumber) {
        return res
          .status(400)
          .json({ error: "key, uploadId, and partNumber are required" });
      }

      const presignedUrl = await UploadService.getPresignedUrl(
        key,
        uploadId,
        Number(partNumber),
      );
      res.json({ success: true, presignedUrl });
    } catch (err) {
      logger.error(err);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Failed to get presigned url. Please retry!",
      });
    }
  }

  public async completeMultipartUpload(req: any, res: any) {
    try {
      const { key, uploadId, parts } = req.body;
      logger.info(
        `key: ${key}, id: ${uploadId}, parts: ${JSON.stringify(parts)}`,
      );
      if (!key || !uploadId || !parts || !Array.isArray(parts)) {
        throw new Error("key, uploadId, and a valid parts array are required");
      }

      const data = await UploadService.completeMultipartUpload(
        key,
        uploadId,
        parts,
      );

      res.json({
        success: true,
        message: data.message,
        location: data.location,
      });
    } catch (err: any) {
      logger.error(err);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }
  }
}

const UploadController = UploadControllerClass.get();
export default UploadController;
