import * as bluebird from "bluebird";
import Redis from "ioredis";
import { logger } from "../logger/logger";

export class RedisConnection {
  public static client: any;
  // Initialize your redis connection
  public static async init(): Promise<any> {
    if (this.client) {
      return;
    }

    // @ts-ignore
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    const t1 = Date.now();

    (this.client as any).Promise = bluebird;

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        logger.info(`Connected to redis server in ${Date.now() - t1}ms`);
        resolve(1);
      });

      this.client.on("error", (err: Error) => {
        logger.info("Failed to connect to redis server");
        reject(`Failed to connect to redis ${err?.message}`);
      });
    });
  }
}
