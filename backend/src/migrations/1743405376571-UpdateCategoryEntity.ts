import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryEntity1743405376571 implements MigrationInterface {
    name = 'UpdateCategoryEntity1743405376571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "userId" integer NOT NULL`);
    }

}
