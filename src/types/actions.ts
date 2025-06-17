export interface IBulkActionStats {
  totalRows: number;
  successfulUpserts: number;
  failedUpserts: number;
  skippedRows: number;
  startTime: string; // ISO string
  endTime: string | null;
}
