import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGender1755989978060 implements MigrationInterface {
    name = 'AddGender1755989978060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`gender\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`gender\``);
    }

}
