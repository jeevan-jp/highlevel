import Queue from "bee-queue";

import { EQUEUE_NAMES, EQueueTask } from "./constants";
import { handleBulkContactEdit } from "./task-handlers";

interface ITaskConfig {
  [key: string]: {
    processor(job: Queue.Job<any>): Promise<any>;
  };
}

interface IQueueConfig {
  [key: string]: {
    queueOptions: Queue.QueueSettings;
    processConcurrency: number;
    tasks: ITaskConfig;
  };
}

export const getQueueConfig = (): IQueueConfig => ({
  [EQUEUE_NAMES.BULK_EDIT_QUEUE]: {
    processConcurrency: 1,
    queueOptions: {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
      removeOnSuccess: false, // Keep successful jobs for tracking
      removeOnFailure: false,
    },
    tasks: {
      [EQueueTask.EDIT_CONTACT]: {
        // can add task specific config in this object
        processor: handleBulkContactEdit,
      },
    },
  },
});
