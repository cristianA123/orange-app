import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePeopleAddChild1762580251054 implements MigrationInterface {
    name = 'ChangePeopleAddChild1762580251054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`children\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`birthDate\` date NULL, \`gender\` varchar(255) NULL, \`differentAbility\` tinyint NULL, \`conadis\` tinyint NULL, \`document\` varchar(255) NULL, \`age\` int NULL, \`birthday\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`people_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`rpas\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`conadis\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`anexo\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`parentName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`motherName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`spouseName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`relationshipType\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`documentContact\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`contactName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`contactPhone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`area\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`jobTitle\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`institution_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`children\` ADD CONSTRAINT \`FK_b5a4c4af87bfcc4d8e18e367716\` FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_4b4579a069639480f1471d33b19\` FOREIGN KEY (\`institution_id\`) REFERENCES \`institutes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_4b4579a069639480f1471d33b19\``);
        await queryRunner.query(`ALTER TABLE \`children\` DROP FOREIGN KEY \`FK_b5a4c4af87bfcc4d8e18e367716\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`institution_id\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`jobTitle\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`area\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`contactPhone\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`contactName\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`documentContact\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`relationshipType\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`spouseName\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`motherName\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`parentName\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`anexo\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`conadis\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`rpas\``);
        await queryRunner.query(`DROP TABLE \`children\``);
    }

}
