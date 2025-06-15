import Queue from "bee-queue";
import { logger } from "../logger/logger";
import { TJobStatus } from "../types/queue";
import { getQueueConfig } from "./config";
import { IBaseTask } from "./constants";

export class BaseQueue extends Queue {
  public processConcurrency: number;

  constructor(name: string) {
    const config = getQueueConfig()[name]; // IMPORTANT: contains a common config for all the queues
    if (!config) {
      throw new Error("Invalid queue name!");
    }
    super(name, config.queueOptions);
    this.processConcurrency = config.processConcurrency || 1;
  }

  public async addTask<T>(
    payloadData: IBaseTask<T>,
  ): Promise<Queue.Job<IBaseTask<T>>> {
    return this.createJob(payloadData).save();
  }

  public async getSucceddedJobs<T>(type: TJobStatus) {
    return this.getJobs(type, { start: 0, end: 100 });
  }

  public async getTaskStatus<T>(taskId: string): Promise<{
    progress: any;
    status: TJobStatus;
    data: IBaseTask<T>;
  }> {
    const job = await super.getJob(taskId);
    return {
      progress: job.progress,
      status: job.status,
      data: job.data,
    };
  }

  /**
   * method to attach common job event listenrs
   */
  public logEvents(): void {
    this.on("ready", async () => {
      logger.info("Queue has begun!");
    });

    this.on("succeeded", (job, result) => {
      logger.info(
        `😍 result of job ${JSON.stringify(job.data, null, 2)} is ${JSON.stringify(result, null, 2)}  😍`,
      );
    });

    this.on("error", (err: Error) => {
      logger.info(`${this.name} failed!! \n${err}`);
    });

    this.on("failed", (job, err: Error) => {
      logger.info(`Job failed \n ${JSON.stringify(job, null, 2)} \n ${err}`);
    });

    this.on("job succeeded", (jobId: string) => {
      logger.info(`${jobId} completed!!`);
    });

    this.on("job failed", (jobId: string, err: Error) => {
      logger.info(`${jobId} failed!! \n ${err}`);
    });

    this.on("job retrying", (jobId: string, err: Error) => {
      logger.info(`${jobId} failed!! \n ${err}`);
    });
  }

  public processTask(): void {
    /**
     * if promise willl be resolved then job will be considered completed
     */
    this.process(
      this.processConcurrency,
      async (job: Queue.Job<IBaseTask<any>>) => {
        const queueConfig = getQueueConfig()[this.name];
        const queueTasks = queueConfig.tasks;
        const handler = queueTasks[job.data.taskName].processor;
        return handler(job);
      },
    );
  }
}
