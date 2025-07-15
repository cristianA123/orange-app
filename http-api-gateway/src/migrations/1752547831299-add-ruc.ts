import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRuc1752547831299 implements MigrationInterface {
    name = 'AddRuc1752547831299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`institutes\` DROP COLUMN \`ruc\``);
        await queryRunner.query(`ALTER TABLE \`institutes\` ADD \`ruc\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`institutes\` DROP COLUMN \`ruc\``);
        await queryRunner.query(`ALTER TABLE \`institutes\` ADD \`ruc\` varchar(12) NOT NULL`);
    }

}
