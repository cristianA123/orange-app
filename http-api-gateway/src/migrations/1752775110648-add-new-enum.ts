import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewEnum1752775110648 implements MigrationInterface {
    name = 'AddNewEnum1752775110648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`institutes\` DROP COLUMN \`ruc\``);
        await queryRunner.query(`ALTER TABLE \`institutes\` ADD \`ruc\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`institutes\` CHANGE \`status\` \`status\` enum ('1', '2', '3', '4') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`institutes\` CHANGE \`status\` \`status\` enum ('1', '2', '3') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`institutes\` DROP COLUMN \`ruc\``);
        await queryRunner.query(`ALTER TABLE \`institutes\` ADD \`ruc\` varchar(12) NOT NULL`);
    }

}
