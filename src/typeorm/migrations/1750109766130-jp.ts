import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class jp1750109766130 implements MigrationInterface {
  public name = "jp1750109766130";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `bulk_actions` DROP COLUMN `errors`");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` ADD `errors` json NULL",
    );
  }
}
