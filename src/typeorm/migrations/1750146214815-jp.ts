import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class jp1750146214815 implements MigrationInterface {
  public name = "jp1750146214815";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` DROP COLUMN `total_chunks`",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` DROP COLUMN `last_chunk`",
    );
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `success`");
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `failed`");
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `skipped`");
    await queryRunner.query("ALTER TABLE `bulk_actions` ADD `stats` json NULL");
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `errors` json NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `errors`");
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `stats`");
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `skipped` int NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `failed` int NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `success` int NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `last_chunk` int NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `total_chunks` int NOT NULL",
    );
  }
}
