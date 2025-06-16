/* tslint:disable */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IBulkActionError } from "../../types/error";
import { EBulkActionStatus } from "../../utils/enums";

/**
 * Table should be designed to accomodate the following actions:
 * 1. progress percentage - formula: (last chunk id / total chunks) * 100
 * 2. action status
 * 3. actions stats - json
 * 4. actions errors - json(Array)
 * 5. jobId - redis(queue) job id
 * 6. timestamps
 * 7. s3 file info
 */

@Entity("bulk_actions")
export class BulkActions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @Column({
    name: "entity",
    length: 30,
    type: "varchar",
    nullable: false,
  })
  entity: string; // contacts, companies, tasks etc.

  @Column({
    name: "status",
    type: "tinyint",
    nullable: false,
    default: EBulkActionStatus.WAITING,
  })
  status: number; // processing - 0, success - 1, failure - 2

  @Column({
    name: "completed_at",
    type: "datetime",
    nullable: true,
  })
  completedAt?: Date;

  @Column({
    name: "progress",
    type: "tinyint",
    nullable: false,
    default: 0,
  })
  progress: number; // range: 0 - 100%

  @Column({
    name: "job_id",
    type: "int",
    nullable: false,
    default: 0,
  })
  queueJobId: number; // range: 0 - 100%

  @Column({
    name: "s3_key",
    length: 100,
    type: "varchar",
    nullable: false,
  })
  s3Key: string; // file name

  @Column({
    name: "s3_location",
    length: 200,
    type: "varchar",
    nullable: false,
  })
  s3Location: string; // final s3 path

  @Column({
    name: "s3_upload_id",
    length: 200,
    type: "varchar",
    nullable: false,
  })
  s3UploadId: string; // multipart uploadId

  @Column({
    name: "errors",
    type: "json",
    nullable: true,
  })
  errors?: IBulkActionError[]; // sample err obj: { chunkId: 1, rowNumber: 19990, msg: "duplicate phone number" };

  @Column({
    name: "total_chunks",
    type: "int",
    nullable: false,
  })
  totalChunks: number;

  @Column({
    name: "last_chunk", // last successful chunk index
    type: "int",
    nullable: true,
  })
  lastChunkId: number;

  @Column({
    name: "success", // count of successful entries
    type: "int",
    nullable: false,
    default: 0,
  })
  successCount: number;

  @Column({
    name: "failed", // failure count
    type: "int",
    nullable: false,
    default: 0,
  })
  failedCount: number;

  @Column({
    name: "skipped", // number of skipped entries
    type: "int",
    nullable: false,
    default: 0,
  })
  skippedCount: number;
}
