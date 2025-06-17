import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class jp1750121381083 implements MigrationInterface {
  public name = "jp1750121381083";

  // tslint:disable-next-line:class-name
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `contacts` DROP COLUMN `first_name`");
    await queryRunner.query(
      "ALTER TABLE `contacts` ADD `name` varchar(30) NOT NULL",
    );
    await queryRunner.query("ALTER TABLE `contacts` DROP COLUMN `email`");
    await queryRunner.query(
      "ALTER TABLE `contacts` ADD `email` varchar(50) NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `contacts` ADD UNIQUE INDEX `IDX_752866c5247ddd34fd05559537` (`email`)",
    );
    await queryRunner.query("ALTER TABLE `contacts` DROP COLUMN `phone`");
    await queryRunner.query(
      "ALTER TABLE `contacts` ADD `phone` varchar(15) NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `contacts` DROP COLUMN `phone`");
    await queryRunner.query(
      "ALTER TABLE `contacts` ADD `phone` varchar(50) NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `contacts` DROP INDEX `IDX_752866c5247ddd34fd05559537`",
    );
    await queryRunner.query("ALTER TABLE `contacts` DROP COLUMN `email`");
    await queryRunner.query(
      "ALTER TABLE `contacts` ADD `email` varchar(250) NULL",
    );
    await queryRunner.query("ALTER TABLE `contacts` DROP COLUMN `name`");
    await queryRunner.query(
      "ALTER TABLE `contacts` ADD `first_name` varchar(250) NOT NULL",
    );
  }
}
