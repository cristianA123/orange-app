import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusIncident31754110686675 implements MigrationInterface {
    name = 'AddStatusIncident31754110686675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` CHANGE \`subtype\` \`subType\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`subType\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`subType\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`subType\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`subType\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` CHANGE \`subType\` \`subtype\` varchar(255) NOT NULL`);
    }

}
