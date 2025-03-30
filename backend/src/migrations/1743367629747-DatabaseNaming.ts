import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatabaseNaming1743367629747 implements MigrationInterface {
  name = 'DatabaseNaming1743367629747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "entry_entity" DROP CONSTRAINT "FK_9d0bc5a742e8e7118f2062e8a5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" DROP CONSTRAINT "FK_a73f39c8a6b5ff9254cf970ec79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entry_entity" RENAME COLUMN "categoryId" TO "category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" ADD "user_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "entry_entity" ADD CONSTRAINT "FK_b90ec0c559a879717f2f6bba3cf" FOREIGN KEY ("category_id") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" ADD CONSTRAINT "FK_2a27182dab51db48ade71d12f05" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category_entity" DROP CONSTRAINT "FK_2a27182dab51db48ade71d12f05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entry_entity" DROP CONSTRAINT "FK_b90ec0c559a879717f2f6bba3cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "last_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "first_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entry_entity" RENAME COLUMN "category_id" TO "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_entity" ADD CONSTRAINT "FK_a73f39c8a6b5ff9254cf970ec79" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entry_entity" ADD CONSTRAINT "FK_9d0bc5a742e8e7118f2062e8a5d" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
