import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldUser1753218045340 implements MigrationInterface {
    name = 'AddFieldUser1753218045340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`documentType\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`documentNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`jobLevel\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`area\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`areaGroup\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`entryDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`contractType\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`identifier\` \`identifier\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`contractType\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`entryDate\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`areaGroup\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`area\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`jobLevel\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`documentNumber\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`documentType\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastName\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)`);
    }

}
