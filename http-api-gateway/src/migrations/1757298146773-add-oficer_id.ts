import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOficerId1757298146773 implements MigrationInterface {
    name = 'AddOficerId1757298146773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`officer_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD CONSTRAINT \`FK_29aabed443bf785d70ab96a0504\` FOREIGN KEY (\`officer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP FOREIGN KEY \`FK_29aabed443bf785d70ab96a0504\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`officer_id\``);
    }

}
