import { MigrationInterface, QueryRunner } from 'typeorm';

export class Images1745909267347 implements MigrationInterface {
  name = 'Images1745909267347';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "entry" ADD "image_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "image_url"`);
  }
}
