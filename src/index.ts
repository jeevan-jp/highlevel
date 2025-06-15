import "reflect-metadata";

import cluster from "cluster";
import dotenv from "dotenv";
import events from "events";
import * as http from "http";
import os from "os";

import app from "./app";
import { logger } from "./logger/logger";
import { Database } from "./typeorm/config/createConnection";
import { RedisConnection } from "./utils/redisConnection";

/**
 * “Any fool can write code that a computer can understand.
 *  Good programmers write code that humans can understand.”
 *    ~ Martin Fowler, 1996
 */

dotenv.config({ path: "../.env " });

// libuv's threadpool have a default of 4 threads for async operations so we are changing it based on cpu cores
process.env.UV_THREADPOOL_SIZE = String(os.cpus().length);

const main = async () => {
  logger.info(`starting worker ${process.pid}`);

  const PORT = process.env.PORT;

  // init database
  const database = new Database();
  const conn = await database.getConnection("default");

  // init redis
  await RedisConnection.init();

  const server = http.createServer(app);

  server.listen(PORT, async () => {
    logger.info(`listening on port ${PORT}`);
  });

  // For socket Maximum connection
  events.EventEmitter.prototype.setMaxListeners(1000000);

  server.on("error", async (err) => {
    if (err) {
      logger.error("Server crashed while listening", err);
      await conn.close();
      throw err;
    }
  });

  server.on("close", async () => {
    logger.warn("Closing server connection");
    await conn.close();
  });

  async function commonErrorHandler(err) {
    logger.warn("SOMETHING BROKE!!");
    logger.error(err);
    if (conn) {
      await conn.close();
      logger.info("DB Connection Closed!!");
    }

    if (RedisConnection.client) {
      RedisConnection.client.quit();
      logger.warn("Closing Redis Connection!!");
    }

    process.exit(0);
  }

  process.on("SIGINT", commonErrorHandler);
  process.on("unhandledRejection", commonErrorHandler);
  process.on("uncaughtException", commonErrorHandler);

  process.on("exit", async () => {
    logger.warn("Process exit detected!!");
  });
};

if (cluster.isPrimary) {
  const num_cpus = 1; // os.cpus().length;
  logger.info(`Master ${process.pid} is running on ${num_cpus} CPU/s`);

  for (let i = 0; i < num_cpus; i++) {
    cluster.fork();
  }

  // Listen for worker events
  cluster.on("online", (worker) => {
    logger.info(`Worker ${worker.process.pid} is online`);
  });

  // if any cluster dies, fork a new one
  cluster.on("exit", () => {
    logger.warn(`Worker ${process.pid} died, forking a new one`);
    cluster.fork();
  });
} else {
  main();
}
