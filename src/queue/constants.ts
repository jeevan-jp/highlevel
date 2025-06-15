export interface IBaseTask<T> {
  taskName: EQueueTask;
  payload: T;
}

export enum EQUEUE_NAMES {
  BULK_EDIT_QUEUE = "bulk-edit-queue",
}

export enum EQueueTask {
  EDIT_CONTACT = "hl-edit-contact", // bulk edit contacts in db
}
