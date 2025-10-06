import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusFiles1759768980923 implements MigrationInterface {
    name = 'AddStatusFiles1759768980923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incident_files\` ADD \`status\` enum ('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incident_files\` DROP COLUMN \`status\``);
    }

}
