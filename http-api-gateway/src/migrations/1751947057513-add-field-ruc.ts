import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldRuc1751947057513 implements MigrationInterface {
    name = 'AddFieldRuc1751947057513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`institutes\` ADD \`ruc\` varchar(12) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`institutes\` DROP COLUMN \`ruc\``);
    }

}
