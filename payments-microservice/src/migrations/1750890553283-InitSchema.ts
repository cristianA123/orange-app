import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1750890553283 implements MigrationInterface {
    name = 'InitSchema1750890553283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`amount2\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`amount2\` float NOT NULL`);
    }

}
