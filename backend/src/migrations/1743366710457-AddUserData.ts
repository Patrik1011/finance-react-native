import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserData1743366710457 implements MigrationInterface {
    name = 'AddUserData1743366710457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "email"`);
    }

}
