export type TJobStatus = "created" | "succeeded" | "failed" | "retrying";

export interface IBulkActionPayload {
  bulkActionId: string;
  s3Location: string;
  s3Key: string;
}
