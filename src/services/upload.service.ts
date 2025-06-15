import { logger } from "../logger/logger";
import { EQUEUE_NAMES, EQueueTask } from "../queue/constants";
import { getQueueInstance } from "../queue/utils/getQueueInstance";

class UploadServiceClass {
  public static get(): UploadServiceClass {
    return this.instance || new UploadServiceClass();
  }
  private static readonly instance: UploadServiceClass;

  public async createBulkActionInQueue(fileName: string, filePath: string) {
    logger.info(`processing ${fileName}, at ${filePath}`);

    const job = await getQueueInstance(EQUEUE_NAMES.BULK_EDIT_QUEUE).addTask({
      taskName: EQueueTask.EDIT_CONTACT,
      payload: { fileName, filePath },
    });

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

const UploadService = UploadServiceClass.get();
export default UploadService;
