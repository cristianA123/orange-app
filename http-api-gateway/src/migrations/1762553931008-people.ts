import { MigrationInterface, QueryRunner } from "typeorm";

export class People1762553931008 implements MigrationInterface {
    name = 'People1762553931008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`people\` (\`id\` varchar(36) NOT NULL, \`paternalSurname\` varchar(255) NOT NULL, \`maternalSurname\` varchar(255) NOT NULL, \`names\` varchar(255) NOT NULL, \`cellphone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`address\` varchar(255) NULL, \`documentType\` varchar(255) NULL, \`document\` varchar(255) NULL, \`gender\` varchar(255) NULL, \`birthDate\` date NULL, \`age\` int NULL, \`domicile\` varchar(255) NULL, \`landline\` varchar(255) NULL, \`healthInsurance\` tinyint NULL, \`insuranceType\` varchar(255) NULL, \`sctr\` tinyint NULL, \`isDonor\` tinyint NULL, \`spouse\` varchar(255) NULL, \`tattoos\` tinyint NULL, \`militaryService\` tinyint NULL, \`weaponsLicense\` tinyint NULL, \`differentAbility\` tinyint NULL, \`height\` int NULL, \`weight\` int NULL, \`childrenNumber\` int NULL, \`emergencyName\` varchar(255) NULL, \`emergencyEmail\` varchar(255) NULL, \`emergencyPhone\` varchar(255) NULL, \`lastModificationDate\` timestamp NULL, \`lastUserModified\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`ubigeo_id\` char(6) NULL, \`nationality_id\` varchar(36) NULL, \`department_id\` char(2) NULL, \`province_id\` char(4) NULL, \`district_id\` char(6) NULL, \`birthplace_department_id\` char(2) NULL, \`marital_status_id\` varchar(36) NULL, \`pension_system_id\` varchar(36) NULL, \`blood_type_id\` varchar(36) NULL, \`emergency_contact_type_id\` varchar(36) NULL, \`origin_id\` varchar(36) NULL, \`education_level_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`people_licenses_a\` (\`people_id\` varchar(36) NOT NULL, \`license_a_id\` varchar(36) NOT NULL, INDEX \`IDX_1290cd156af481896020fb434c\` (\`people_id\`), INDEX \`IDX_7db405bf38d7640aeec44b1f1c\` (\`license_a_id\`), PRIMARY KEY (\`people_id\`, \`license_a_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`people_licenses_b\` (\`people_id\` varchar(36) NOT NULL, \`license_b_id\` varchar(36) NOT NULL, INDEX \`IDX_ef74aaa1122c31afe274f54a80\` (\`people_id\`), INDEX \`IDX_8129fea16d66ba3a7bdbe1f135\` (\`license_b_id\`), PRIMARY KEY (\`people_id\`, \`license_b_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_048c4b506a25a16dbcb8c20b483\` FOREIGN KEY (\`ubigeo_id\`) REFERENCES \`districts\`(\`disID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_16ec27957b3db713884099d3724\` FOREIGN KEY (\`nationality_id\`) REFERENCES \`nationalities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_cf3092a5fa742815c7f2028c62d\` FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`depID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_24028149c2560e7c586ffcd0eaf\` FOREIGN KEY (\`province_id\`) REFERENCES \`provinces\`(\`proID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_7d834169c0b4a277f7bb8d8be94\` FOREIGN KEY (\`district_id\`) REFERENCES \`districts\`(\`disID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_9204f9005e015cf59b69b6a4a43\` FOREIGN KEY (\`birthplace_department_id\`) REFERENCES \`departments\`(\`depID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_d0afe0d9744098ec4b6f9c548bc\` FOREIGN KEY (\`marital_status_id\`) REFERENCES \`marital_statuses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_7fed5e8e6f67a3a68eedf337994\` FOREIGN KEY (\`pension_system_id\`) REFERENCES \`pension_systems\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_0f5df7b0824db92444164c17b5d\` FOREIGN KEY (\`blood_type_id\`) REFERENCES \`blood_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_31db81ce242bd4a644158f80ede\` FOREIGN KEY (\`emergency_contact_type_id\`) REFERENCES \`emergency_contact_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_1f279e7b6b6c205ece502404dfd\` FOREIGN KEY (\`origin_id\`) REFERENCES \`origins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_8fa47c24667b584eac7be140a42\` FOREIGN KEY (\`education_level_id\`) REFERENCES \`education_levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people_licenses_a\` ADD CONSTRAINT \`FK_1290cd156af481896020fb434ca\` FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_licenses_a\` ADD CONSTRAINT \`FK_7db405bf38d7640aeec44b1f1c9\` FOREIGN KEY (\`license_a_id\`) REFERENCES \`licenses_a\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_licenses_b\` ADD CONSTRAINT \`FK_ef74aaa1122c31afe274f54a807\` FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_licenses_b\` ADD CONSTRAINT \`FK_8129fea16d66ba3a7bdbe1f1357\` FOREIGN KEY (\`license_b_id\`) REFERENCES \`licenses_b\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`people_licenses_b\` DROP FOREIGN KEY \`FK_8129fea16d66ba3a7bdbe1f1357\``);
        await queryRunner.query(`ALTER TABLE \`people_licenses_b\` DROP FOREIGN KEY \`FK_ef74aaa1122c31afe274f54a807\``);
        await queryRunner.query(`ALTER TABLE \`people_licenses_a\` DROP FOREIGN KEY \`FK_7db405bf38d7640aeec44b1f1c9\``);
        await queryRunner.query(`ALTER TABLE \`people_licenses_a\` DROP FOREIGN KEY \`FK_1290cd156af481896020fb434ca\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_8fa47c24667b584eac7be140a42\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_1f279e7b6b6c205ece502404dfd\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_31db81ce242bd4a644158f80ede\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_0f5df7b0824db92444164c17b5d\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_7fed5e8e6f67a3a68eedf337994\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_d0afe0d9744098ec4b6f9c548bc\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_9204f9005e015cf59b69b6a4a43\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_7d834169c0b4a277f7bb8d8be94\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_24028149c2560e7c586ffcd0eaf\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_cf3092a5fa742815c7f2028c62d\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_16ec27957b3db713884099d3724\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_048c4b506a25a16dbcb8c20b483\``);
        await queryRunner.query(`DROP INDEX \`IDX_8129fea16d66ba3a7bdbe1f135\` ON \`people_licenses_b\``);
        await queryRunner.query(`DROP INDEX \`IDX_ef74aaa1122c31afe274f54a80\` ON \`people_licenses_b\``);
        await queryRunner.query(`DROP TABLE \`people_licenses_b\``);
        await queryRunner.query(`DROP INDEX \`IDX_7db405bf38d7640aeec44b1f1c\` ON \`people_licenses_a\``);
        await queryRunner.query(`DROP INDEX \`IDX_1290cd156af481896020fb434c\` ON \`people_licenses_a\``);
        await queryRunner.query(`DROP TABLE \`people_licenses_a\``);
        await queryRunner.query(`DROP TABLE \`people\``);
    }

}
