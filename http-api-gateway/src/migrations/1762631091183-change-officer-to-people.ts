import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOfficerToPeople1762631091183 implements MigrationInterface {
    name = 'ChangeOfficerToPeople1762631091183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`peopleName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`people_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD CONSTRAINT \`FK_080e75c8bea0c589b515484b352\` FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP FOREIGN KEY \`FK_080e75c8bea0c589b515484b352\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`people_id\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`peopleName\``);
    }

}
