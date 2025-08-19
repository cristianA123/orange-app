import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIncidentStatus1755577013826 implements MigrationInterface {
    name = 'AddIncidentStatus1755577013826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`status\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`status\` int NOT NULL`);
    }

}
