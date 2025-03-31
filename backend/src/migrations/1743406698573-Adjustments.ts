import { MigrationInterface, QueryRunner } from "typeorm";

export class Adjustments1743406698573 implements MigrationInterface {
    name = 'Adjustments1743406698573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "FK_13290f54efdc9f5564c58847d74" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "FK_13290f54efdc9f5564c58847d74"`);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "user_id"`);
    }

}
