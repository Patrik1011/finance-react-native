import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUsers1745169990145 implements MigrationInterface {
    name = 'FixUsers1745169990145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "userId" integer NOT NULL`);
    }

}
