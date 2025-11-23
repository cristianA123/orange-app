import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContractTables1763840000000 implements MigrationInterface {
  name = 'CreateContractTables1763840000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create contract_types table
    await queryRunner.query(`
            CREATE TABLE \`contract_types\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

    // Create areas table
    await queryRunner.query(`
            CREATE TABLE \`areas\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

    // Create contracts table
    await queryRunner.query(`
            CREATE TABLE \`contracts\` (
                \`id\` varchar(36) NOT NULL,
                \`people_id\` varchar(36) NULL,
                \`contract_type_id\` int NULL,
                \`area_id\` int NULL,
                \`cargo_id\` varchar(36) NULL,
                \`startDate\` date NOT NULL,
                \`endDate\` date NULL,
                \`workedTime\` varchar(255) NULL,
                \`reasonForTermination\` varchar(255) NULL,
                \`isActive\` tinyint NOT NULL DEFAULT 1,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

    // Create contract_files table
    await queryRunner.query(`
            CREATE TABLE \`contract_files\` (
                \`id\` varchar(36) NOT NULL,
                \`fileName\` varchar(255) NOT NULL,
                \`url\` varchar(255) NOT NULL,
                \`mimeType\` varchar(255) NULL,
                \`size\` int NULL,
                \`extension\` varchar(255) NULL,
                \`fileType\` enum ('CV', 'TDR', 'CONTRACT', 'TERMINATION', 'OTHER') NOT NULL DEFAULT 'OTHER',
                \`contract_id\` varchar(36) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`contract_files\``);
    await queryRunner.query(`DROP TABLE \`contracts\``);
    await queryRunner.query(`DROP TABLE \`areas\``);
    await queryRunner.query(`DROP TABLE \`contract_types\``);
  }
}
