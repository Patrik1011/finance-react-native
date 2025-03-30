import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRelationsToEntities1743366608232 implements MigrationInterface {
    name = 'AddUserRelationsToEntities1743366608232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "entry_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "amount" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_8ae42f7d32ae1b6701016529e73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '', "userId" integer NOT NULL, CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_entity_role_enum" AS ENUM('admin', 'user', 'premium_user')`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_entity_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "entry_entity" ADD CONSTRAINT "FK_9d0bc5a742e8e7118f2062e8a5d" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD CONSTRAINT "FK_a73f39c8a6b5ff9254cf970ec79" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" DROP CONSTRAINT "FK_a73f39c8a6b5ff9254cf970ec79"`);
        await queryRunner.query(`ALTER TABLE "entry_entity" DROP CONSTRAINT "FK_9d0bc5a742e8e7118f2062e8a5d"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TYPE "public"."user_entity_role_enum"`);
        await queryRunner.query(`DROP TABLE "category_entity"`);
        await queryRunner.query(`DROP TABLE "entry_entity"`);
    }

}
