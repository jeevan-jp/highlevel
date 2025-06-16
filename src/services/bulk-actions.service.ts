import { logger } from "../logger/logger";
import { EQUEUE_NAMES, EQueueTask } from "../queue/constants";
import { getQueueInstance } from "../queue/utils/getQueueInstance";
import { IBulkActionPayload } from "../types/queue";

const MAX_RETRIES_BEFORE_FAILURE = 3;

class BulkActionServiceClass {
  public static get(): BulkActionServiceClass {
    return this.instance || new BulkActionServiceClass();
  }
  private static readonly instance: BulkActionServiceClass;

  public async createBulkActionInQueue(payload: IBulkActionPayload) {
    const job = await getQueueInstance(EQUEUE_NAMES.BULK_EDIT_QUEUE).addTask({
      taskName: EQueueTask.EDIT_CONTACT,
      payload,
    });

    job.retries(MAX_RETRIES_BEFORE_FAILURE);

    logger.info(`bulk actions scheduled with action id: ${job.id}`);

    return job;
  }

  public async getQueueJobs() {
    const jobs = await getQueueInstance(
      EQUEUE_NAMES.BULK_EDIT_QUEUE,
    ).getSucceddedJobs("succeeded");
    return jobs.map((J) => ({
      id: J.id,
      progress: J.progress,
      status: J.status,
    }));
  }

  public async getJobStatus(taskId: string) {
    const statusData = await getQueueInstance(
      EQUEUE_NAMES.BULK_EDIT_QUEUE,
    ).getTaskStatus(taskId);
    return statusData;
  }
}

const BulkActionService = BulkActionServiceClass.get();
export default BulkActionService;
