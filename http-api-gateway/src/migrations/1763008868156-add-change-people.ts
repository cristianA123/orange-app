import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChangePeople1763008868156 implements MigrationInterface {
    name = 'AddChangePeople1763008868156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`domicile\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`landline\``);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`birthplaceAnexo\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`birthplaceAddress\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`residenceAnexo\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`residenceAddress\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`landlinePhone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`birthplace_province_id\` char(4) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`birthplace_district_id\` char(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`residence_department_id\` char(2) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`residence_province_id\` char(4) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`residence_district_id\` char(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_9a1c67848d51dfddc6f231254f2\` FOREIGN KEY (\`birthplace_province_id\`) REFERENCES \`provinces\`(\`proID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_6196739ad4a768467ae7b2319a2\` FOREIGN KEY (\`birthplace_district_id\`) REFERENCES \`districts\`(\`disID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_75ad9ed971ee599403b9cbc2bcd\` FOREIGN KEY (\`residence_department_id\`) REFERENCES \`departments\`(\`depID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_bf47d47e7f15a88de7975dbef19\` FOREIGN KEY (\`residence_province_id\`) REFERENCES \`provinces\`(\`proID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD CONSTRAINT \`FK_a115d1937c23ea04f1363d67745\` FOREIGN KEY (\`residence_district_id\`) REFERENCES \`districts\`(\`disID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_a115d1937c23ea04f1363d67745\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_bf47d47e7f15a88de7975dbef19\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_75ad9ed971ee599403b9cbc2bcd\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_6196739ad4a768467ae7b2319a2\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_9a1c67848d51dfddc6f231254f2\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`residence_district_id\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`residence_province_id\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`residence_department_id\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`birthplace_district_id\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`birthplace_province_id\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`landlinePhone\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`residenceAddress\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`residenceAnexo\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`birthplaceAddress\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`birthplaceAnexo\``);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`landline\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`domicile\` varchar(255) NULL`);
    }

}
