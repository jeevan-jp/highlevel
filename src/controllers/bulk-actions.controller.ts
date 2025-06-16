import { StatusCodes } from "http-status-codes";
import { logger } from "../logger/logger";
import UploadService from "../services/upload.service";

// class using Singleton Pattern
class BulkActionControllerClass {
  public static get(): BulkActionControllerClass {
    return this.instance || new BulkActionControllerClass();
  }

  private static readonly instance: BulkActionControllerClass;

  public async createBulkAction(req: any, res: any) {
    try {
      const { fileName, filePath } = req.body;
      const job = await UploadService.createBulkActionInQueue(
        fileName,
        filePath,
      );

      res.json({
        success: true,
        id: job.id,
        message: `Request accepted with id: ${job.id}. You will receive updates over email.`,
      });
    } catch (err) {
      logger.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create bulk action, please retry!",
      });
    }
  }

  public async getSucceddedActions(req: any, res: any) {
    try {
      const actions = await UploadService.getQueueJobs();
      res.json({ success: true, actions });
    } catch (err) {
      logger.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch details, please retry!",
      });
    }
  }

  public async getAction(req: any, res: any) {
    try {
      const bulkActionStatus = await UploadService.getJobStatus(
        req.params.actionId,
      );
      res.json({ success: true, data: bulkActionStatus });
    } catch (err) {
      logger.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch job status. Kindly retry!",
      });
    }
  }

  public async getActionStats(req: any, res: any) {
    try {
      // job stats: success, failure, skipped etc.
      res.json({
        success: true,
        data: { succedded: 0, failed: 0, skipped: 0 },
      });
    } catch (err) {
      logger.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch job status. Kindly retry!",
      });
    }
  }
}

const BulkActionController = BulkActionControllerClass.get();
export default BulkActionController;
