import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class jp1750106094252 implements MigrationInterface {
  public name = "jp1750106094252";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `bulk_actions` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL, `entity` varchar(30) NOT NULL, `status` tinyint NOT NULL DEFAULT '0', `completed_at` datetime NOT NULL, `progress` tinyint NOT NULL DEFAULT '0', `job_id` int NOT NULL DEFAULT '0', `s3_key` varchar(100) NOT NULL, `s3_location` varchar(200) NOT NULL, `s3_upload_id` varchar(200) NOT NULL, `errors` json NULL, `total_chunks` int NOT NULL, `last_chunk` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `bulk_actions`");
  }
}
