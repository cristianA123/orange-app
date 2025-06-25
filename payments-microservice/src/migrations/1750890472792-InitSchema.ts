import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1750890472792 implements MigrationInterface {
    name = 'InitSchema1750890472792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`amount2\` float NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`amount2\``);
    }

}
