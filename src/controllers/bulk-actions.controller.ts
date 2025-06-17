import { StatusCodes } from "http-status-codes";
import { getRepository } from "typeorm";
import { logger } from "../logger/logger";
import BulkActionService from "../services/bulk-actions.service";
import { BulkActions } from "../typeorm/entities/bulkActions";

// class using Singleton Pattern
class BulkActionControllerClass {
  public static get(): BulkActionControllerClass {
    return this.instance || new BulkActionControllerClass();
  }

  private static readonly instance: BulkActionControllerClass;

  public async listBulkActions(req: any, res: any) {
    try {
      const { limit, page } = req.query;
      logger.info(`l: ${limit}; page: ${page}`);
      if (!limit || !page) {
        throw new Error("missing/invalid fields");
      }

      const skip = Number(page - 1) * Number(limit);
      const data = await getRepository(BulkActions).find({
        take: Number(limit),
        skip,
      });

      res.json({ success: true, data });
    } catch (err: any) {
      logger.error(err);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }
  }

  public async getAction(req: any, res: any) {
    try {
      const data = await BulkActionService.getJobStatus(req.params.actionId);
      if (!data) {
        throw new Error(`Invalid action id`);
      }
      res.json({ success: true, data });
    } catch (err: any) {
      logger.error(err);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message ?? "Failed to fetch job status. Kindly retry!",
      });
    }
  }

  public async getActionStats(req: any, res: any) {
    try {
      // job stats: success, failure, skipped etc.
      const data = await BulkActionService.getActionStats(req.params.actionId);
      if (!data) {
        throw new Error(`Invalid action id`);
      }

      res.json({
        success: true,
        data: data.stats,
      });
    } catch (err: any) {
      logger.error(err);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message ?? "Failed to fetch job status. Kindly retry!",
      });
    }
  }
}

const BulkActionController = BulkActionControllerClass.get();
export default BulkActionController;
