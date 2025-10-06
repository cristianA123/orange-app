import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileName1759719182525 implements MigrationInterface {
    name = 'AddFileName1759719182525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incident_files\` ADD \`fileName\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incident_files\` DROP COLUMN \`fileName\``);
    }

}
