import { StatusCodes } from "http-status-codes";
import { logger } from "../logger/logger";
import LogActionService from "../services/log.service";

class LogControllerClass {
  public static get(): LogControllerClass {
    return this.instance || new LogControllerClass();
  }

  private static readonly instance: LogControllerClass;

  public async fetchLogs(req: any, res: any) {
    try {
      const { error } = req.query;
      const text = await LogActionService.readLogFile(error, false);

      res.set("Content-Type", "text/plain");
      res.send(text);
    } catch (err) {
      logger.error(err);
      res.stats(StatusCodes.BAD_REQUEST).json("failed to fetch logs");
    }
  }

  public async fetchWorkerLogs(req: any, res: any) {
    try {
      const { error } = req.query;
      const text = await LogActionService.readLogFile(error, true);

      res.set("Content-Type", "text/plain");
      res.send(text);
    } catch (err) {
      logger.error(err);
      res.stats(StatusCodes.BAD_REQUEST).json("failed to fetch logs");
    }
  }
}

const LogController = LogControllerClass.get();
export default LogController;
