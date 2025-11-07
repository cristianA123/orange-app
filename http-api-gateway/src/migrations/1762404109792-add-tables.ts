import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1762404109792 implements MigrationInterface {
    name = 'AddTables1762404109792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`departments\` (\`depID\` char(2) NOT NULL, \`depNombre\` varchar(150) NULL, PRIMARY KEY (\`depID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`provinces\` (\`proID\` char(4) NOT NULL, \`proDep\` char(2) NULL, \`proNombre\` varchar(150) NULL, PRIMARY KEY (\`proID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`districts\` (\`disID\` char(6) NOT NULL, \`disDep\` char(2) NULL, \`disProv\` char(4) NULL, \`disNombre\` varchar(150) NULL, PRIMARY KEY (\`disID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`origins\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_bc55f9f7b4e5167cde38a8d3c7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blood_types\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8c9cd84c84ae55eb8510f09127\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`education_levels\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1c84617b3b00d8d7b434ca60dd\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`emergency_contact_types\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e2769bda8e5fa651a7308fcc66\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`licenses_a\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_716bffbf6a00c4aef327c81bc1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`licenses_b\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_99316c98ab4c5d979d4ddf4b38\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`marital_statuses\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fec7a515069b91f409a564197b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nationalities\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_324b0ecd4238212688f0803451\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pension_systems\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_379ba3e34a78c2bc586182874d\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`incident_files\` CHANGE \`file_type\` \`file_type\` enum ('IMAGE', 'VIDEO', 'DOCUMENT', 'PDF', 'OTHER') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD CONSTRAINT \`FK_0d518ca13332ae8023b35c1b149\` FOREIGN KEY (\`proDep\`) REFERENCES \`departments\`(\`depID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`districts\` ADD CONSTRAINT \`FK_9f0dd9478489cb9ead0d956537a\` FOREIGN KEY (\`disProv\`) REFERENCES \`provinces\`(\`proID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_9f0dd9478489cb9ead0d956537a\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP FOREIGN KEY \`FK_0d518ca13332ae8023b35c1b149\``);
        await queryRunner.query(`ALTER TABLE \`incident_files\` CHANGE \`file_type\` \`file_type\` enum ('IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER') NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_379ba3e34a78c2bc586182874d\` ON \`pension_systems\``);
        await queryRunner.query(`DROP TABLE \`pension_systems\``);
        await queryRunner.query(`DROP INDEX \`IDX_324b0ecd4238212688f0803451\` ON \`nationalities\``);
        await queryRunner.query(`DROP TABLE \`nationalities\``);
        await queryRunner.query(`DROP INDEX \`IDX_fec7a515069b91f409a564197b\` ON \`marital_statuses\``);
        await queryRunner.query(`DROP TABLE \`marital_statuses\``);
        await queryRunner.query(`DROP INDEX \`IDX_99316c98ab4c5d979d4ddf4b38\` ON \`licenses_b\``);
        await queryRunner.query(`DROP TABLE \`licenses_b\``);
        await queryRunner.query(`DROP INDEX \`IDX_716bffbf6a00c4aef327c81bc1\` ON \`licenses_a\``);
        await queryRunner.query(`DROP TABLE \`licenses_a\``);
        await queryRunner.query(`DROP INDEX \`IDX_e2769bda8e5fa651a7308fcc66\` ON \`emergency_contact_types\``);
        await queryRunner.query(`DROP TABLE \`emergency_contact_types\``);
        await queryRunner.query(`DROP INDEX \`IDX_1c84617b3b00d8d7b434ca60dd\` ON \`education_levels\``);
        await queryRunner.query(`DROP TABLE \`education_levels\``);
        await queryRunner.query(`DROP INDEX \`IDX_8c9cd84c84ae55eb8510f09127\` ON \`blood_types\``);
        await queryRunner.query(`DROP TABLE \`blood_types\``);
        await queryRunner.query(`DROP INDEX \`IDX_bc55f9f7b4e5167cde38a8d3c7\` ON \`origins\``);
        await queryRunner.query(`DROP TABLE \`origins\``);
        await queryRunner.query(`DROP TABLE \`districts\``);
        await queryRunner.query(`DROP TABLE \`provinces\``);
        await queryRunner.query(`DROP TABLE \`departments\``);
    }

}
