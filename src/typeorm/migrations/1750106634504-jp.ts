import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class jp1750106634504 implements MigrationInterface {
  public name = "jp1750106634504";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` CHANGE `completed_at` `completed_at` datetime NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bulk_actions` CHANGE `completed_at` `completed_at` datetime NOT NULL",
    );
  }
}
