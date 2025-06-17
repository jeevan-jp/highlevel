/* tslint:disable */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EBulkActionStatus } from "../../utils/enums";
import { IBulkActionStats } from "../../types/actions";

/**
 * Table should be designed to accomodate the following actions:
 * 1. action status
 * 2. actions stats - json
 * 3. actions errors - json(Array)
 * 4. jobId - redis(queue) job id
 * 5. timestamps
 * 6. s3 file info
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
    name: "job_id",
    type: "int",
    nullable: false,
    default: 0,
  })
  queueJobId: number; // queue job id

  @Column({
    name: "last_chunk_id",
    type: "int",
    nullable: false,
    default: 0,
  })
  lastSuccessfulChunkIndex: number;

  @Index({ unique: true })
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
    name: "stats",
    type: "json",
    nullable: true,
  })
  stats: IBulkActionStats; // multipart uploadId

  @Column({
    name: "errors",
    type: "json",
    nullable: true,
  })
  errors: any[]; // multipart uploadId
}
