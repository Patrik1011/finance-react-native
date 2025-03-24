import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedTables1742759727051 implements MigrationInterface {
  name = 'CreatedTables1742759727051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "entry" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "amount" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_a58c675c4c129a8e0f63d3676d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_entity_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_entity_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "entry" ADD CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "entry" DROP CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8"`,
    );
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TYPE "public"."user_entity_role_enum"`);
    await queryRunner.query(`DROP TABLE "entry"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
