import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class jp1750011007179 implements MigrationInterface {
  public name = "jp1750011007179";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `contacts` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL, `first_name` varchar(250) NOT NULL, `email` varchar(250) NULL, `phone` varchar(50) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `contacts`");
  }
}
