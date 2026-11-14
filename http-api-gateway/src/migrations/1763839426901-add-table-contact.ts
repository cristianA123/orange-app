import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableContact1763839426901 implements MigrationInterface {
    name = 'AddTableContact1763839426901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`contract_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`areas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contract_files\` (\`id\` varchar(36) NOT NULL, \`fileName\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`mimeType\` varchar(255) NULL, \`size\` int NULL, \`extension\` varchar(255) NULL, \`fileType\` enum ('CV', 'TDR', 'CONTRACT', 'TERMINATION', 'OTHER') NOT NULL DEFAULT 'OTHER', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`contract_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contracts\` (\`id\` varchar(36) NOT NULL, \`startDate\` date NOT NULL, \`endDate\` date NULL, \`workedTime\` varchar(255) NULL, \`reasonForTermination\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`people_id\` varchar(36) NULL, \`contract_type_id\` int NULL, \`area_id\` int NULL, \`cargo_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`people\` ADD \`status\` enum ('ACTIVE', 'INACTIVE', 'REENTRY') NOT NULL DEFAULT 'INACTIVE'`);
        await queryRunner.query(`ALTER TABLE \`contract_files\` ADD CONSTRAINT \`FK_004389a38fce6d7f1ba52017f45\` FOREIGN KEY (\`contract_id\`) REFERENCES \`contracts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_c590ff49418071be2be717d7744\` FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_68979013900fe56571594d823b4\` FOREIGN KEY (\`contract_type_id\`) REFERENCES \`contract_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_89bc26955009b3d1efd8592e61d\` FOREIGN KEY (\`area_id\`) REFERENCES \`areas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_2b1a7080bcc85a82a8140b784dd\` FOREIGN KEY (\`cargo_id\`) REFERENCES \`cargos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_2b1a7080bcc85a82a8140b784dd\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_89bc26955009b3d1efd8592e61d\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_68979013900fe56571594d823b4\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_c590ff49418071be2be717d7744\``);
        await queryRunner.query(`ALTER TABLE \`contract_files\` DROP FOREIGN KEY \`FK_004389a38fce6d7f1ba52017f45\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`status\``);
        await queryRunner.query(`DROP TABLE \`contracts\``);
        await queryRunner.query(`DROP TABLE \`contract_files\``);
        await queryRunner.query(`DROP TABLE \`areas\``);
        await queryRunner.query(`DROP TABLE \`contract_types\``);
    }

}
