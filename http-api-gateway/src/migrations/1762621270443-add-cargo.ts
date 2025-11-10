import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCargo1762621270443 implements MigrationInterface {
    name = 'AddCargo1762621270443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cargos\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`source\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`cargo_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_6e61c8f3cd1a57cfb0663399dba\` FOREIGN KEY (\`cargo_id\`) REFERENCES \`cargos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_6e61c8f3cd1a57cfb0663399dba\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`cargo_id\``);
        await queryRunner.query(`DROP TABLE \`cargos\``);
    }

}
