import fs from "fs";

const ERR_LOGS_FILE = ".logs/out.log";
const WORKER_ERR_LOGS_FILE = ".logs/worker/out.log";
const COMBINED_LOGS_FILE = ".logs/combined.outerr.log";
const W_COMBINED_LOGS_FILE = ".logs/worker/combined.outerr.log";

class LogServiceClass {
  public static get(): LogServiceClass {
    return this.instance || new LogServiceClass();
  }
  private static readonly instance: LogServiceClass;

  public async readLogFile(onlyErrLog: boolean, isWorker: boolean) {
    // read combined.out.err file
    const serverLogFile = onlyErrLog ? ERR_LOGS_FILE : COMBINED_LOGS_FILE;
    const workerLogFile = onlyErrLog
      ? WORKER_ERR_LOGS_FILE
      : W_COMBINED_LOGS_FILE;

    const file = fs.readFileSync(
      isWorker ? workerLogFile : serverLogFile,
      "utf-8",
    );

    return file;
  }
}

const LogActionService = LogServiceClass.get();
export default LogActionService;
