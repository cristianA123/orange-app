import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusIncident1754108312286 implements MigrationInterface {
    name = 'AddStatusIncident1754108312286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`status\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`status\``);
    }

}
