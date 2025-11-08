import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAnexo1762582256259 implements MigrationInterface {
    name = 'ChangeAnexo1762582256259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`anexo\``);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`anexo\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`anexo\``);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`anexo\` tinyint NULL`);
    }

}
