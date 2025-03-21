import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedTables1638928423925 implements MigrationInterface {
  name = 'CreatedTables1638928423925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_2f8d1a3c57b14a23b7e6d892c41" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
