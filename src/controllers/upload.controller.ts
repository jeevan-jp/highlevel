import { StatusCodes } from "http-status-codes";
import { logger } from "../logger/logger";

class UploadControllerClass {
  public static get(): UploadControllerClass {
    return this.instance || new UploadControllerClass();
  }

  private static readonly instance: UploadControllerClass;

  public async initiateMultipartUpload(req: any, res: any) {
    try {
      res.json({ success: true });
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
      res.json({ success: true });
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
      res.json({ success: true });
    } catch (err) {
      logger.error(err);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Failed to finish multipart upload. Please retry!",
      });
    }
  }
}

const UploadController = UploadControllerClass.get();
export default UploadController;
