import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class jp1750109589164 implements MigrationInterface {
  public name = "jp1750109589164";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `success` int NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `failed` int NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `skipped` int NOT NULL DEFAULT '0'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `skipped`");
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `failed`");
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `success`");
  }
}
