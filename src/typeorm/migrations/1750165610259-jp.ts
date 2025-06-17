import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class jp1750165610259 implements MigrationInterface {
  public name = "jp1750165610259";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` DROP COLUMN `progress`",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD UNIQUE INDEX `IDX_7fcc8af226f2aa0dc52adecc2d` (`s3_key`)",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` DROP INDEX `IDX_7fcc8af226f2aa0dc52adecc2d`",
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `progress` tinyint NOT NULL DEFAULT '0'",
    );
  }
}
