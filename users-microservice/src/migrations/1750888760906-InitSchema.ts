import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1750888760906 implements MigrationInterface {
    name = 'InitSchema1750888760906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`displayName2\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`displayName3\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`displayName3\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`displayName2\` varchar(255) NULL`);
    }

}
