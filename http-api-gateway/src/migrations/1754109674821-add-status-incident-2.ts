import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusIncident21754109674821 implements MigrationInterface {
    name = 'AddStatusIncident21754109674821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` CHANGE \`source\` \`form_type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`form_type\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`form_type\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`form_type\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`form_type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` CHANGE \`form_type\` \`source\` varchar(255) NOT NULL`);
    }

}
