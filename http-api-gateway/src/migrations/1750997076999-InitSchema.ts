import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1750997076999 implements MigrationInterface {
    name = 'InitSchema1750997076999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(255) NOT NULL, \`institute_id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`identifier\` varchar(255) NOT NULL, \`status\` enum ('1', '2', '3', '4', '5') NOT NULL, \`rol\` enum ('SUPERADMIN', 'ADMIN', 'DISPATCHER') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`incident_files\` ADD CONSTRAINT \`FK_80ea3ae0f3d3b0c1e735143f24c\` FOREIGN KEY (\`incident_id\`) REFERENCES \`incidents\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incident_files\` ADD CONSTRAINT \`FK_8aadd034ee926a529551324077e\` FOREIGN KEY (\`institute_id\`) REFERENCES \`institutes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD CONSTRAINT \`FK_66f302514887c0a1202dc48c239\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD CONSTRAINT \`FK_cddb24f19fda9bd3e0c23b0ad25\` FOREIGN KEY (\`institute_id\`) REFERENCES \`institutes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`institute_modules\` ADD CONSTRAINT \`FK_bf4e0c917103a937fec9eb780da\` FOREIGN KEY (\`institute_id\`) REFERENCES \`institutes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`institute_modules\` ADD CONSTRAINT \`FK_ce576149496d535cda0bac32493\` FOREIGN KEY (\`module_id\`) REFERENCES \`modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`modules\` ADD CONSTRAINT \`FK_a1bd9c21d7179d0b411dbaf9a55\` FOREIGN KEY (\`parent_id\`) REFERENCES \`modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_modules\` ADD CONSTRAINT \`FK_5842b0e6bae3cf2f28d36f5b35f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_modules\` ADD CONSTRAINT \`FK_8d557af52554a188e079b198e98\` FOREIGN KEY (\`module_id\`) REFERENCES \`modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_d11afe6995bfdb198cb9ee0dde2\` FOREIGN KEY (\`institute_id\`) REFERENCES \`institutes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_d11afe6995bfdb198cb9ee0dde2\``);
        await queryRunner.query(`ALTER TABLE \`user_modules\` DROP FOREIGN KEY \`FK_8d557af52554a188e079b198e98\``);
        await queryRunner.query(`ALTER TABLE \`user_modules\` DROP FOREIGN KEY \`FK_5842b0e6bae3cf2f28d36f5b35f\``);
        await queryRunner.query(`ALTER TABLE \`modules\` DROP FOREIGN KEY \`FK_a1bd9c21d7179d0b411dbaf9a55\``);
        await queryRunner.query(`ALTER TABLE \`institute_modules\` DROP FOREIGN KEY \`FK_ce576149496d535cda0bac32493\``);
        await queryRunner.query(`ALTER TABLE \`institute_modules\` DROP FOREIGN KEY \`FK_bf4e0c917103a937fec9eb780da\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP FOREIGN KEY \`FK_cddb24f19fda9bd3e0c23b0ad25\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP FOREIGN KEY \`FK_66f302514887c0a1202dc48c239\``);
        await queryRunner.query(`ALTER TABLE \`incident_files\` DROP FOREIGN KEY \`FK_8aadd034ee926a529551324077e\``);
        await queryRunner.query(`ALTER TABLE \`incident_files\` DROP FOREIGN KEY \`FK_80ea3ae0f3d3b0c1e735143f24c\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
