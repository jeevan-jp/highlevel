/**
 * Common module to run all kinds of queue processes.
 * Note: The moduel instantiates queue using queue name coming from args in PM2 json config.
 */
import dotenv from "dotenv";
import { logger } from "./logger/logger";
import { EQUEUE_NAMES } from "./queue/constants";
import { getQueueInstance } from "./queue/utils/getQueueInstance";
import { Database } from "./typeorm/config/createConnection";
import { RedisConnection } from "./utils/redisConnection";

const CONN_NAME = "hl-worker";

// this is the entry point to queue process hence the following import is required
dotenv.config({ path: "../.env " });

async function run() {
  // init database
  const database = new Database();
  const conn = await database.getConnection(CONN_NAME);

  // init redis
  await RedisConnection.init();

  // find out queue name from args
  const queueName = process.argv[2] as EQUEUE_NAMES;

  // get queue instance(memoized)
  const queue = getQueueInstance(queueName);

  // register queue events handlers
  queue.processTask();
  queue.logEvents();

  const commonErrorHandler = async () => {
    try {
      // tslint:disable-next-line:no-console
      logger.warn("Exiting from the queue script");
      await queue.close(2000); // 2sec
      if (conn) {
        logger.warn("Closing DB Connnection!!");
        await conn.close();
      }
    } catch (err) {
      logger.info("bee-queue failed to shut down gracefully", err);
    }

    process.exit(1);
  };

  process.on("SIGINT", commonErrorHandler);
  process.on("unhandledRejection", commonErrorHandler);
  process.on("uncaughtException", commonErrorHandler);

  process.on("exit", async () => {
    logger.warn("Exit Singal Detected!");

    if (conn) {
      logger.warn("Closing DB Connnection!!");
      await conn.close();
    }

    if (RedisConnection.client) {
      RedisConnection.client.quit();
      logger.warn("Closed Redis Connection!!");
    }
  });

  logger.info("queue started!");
}

run();
