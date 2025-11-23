import { MigrationInterface, QueryRunner } from "typeorm";

export class TableContract1763840071805 implements MigrationInterface {
    name = 'TableContract1763840071805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys only if they exist
        await queryRunner.query(`
            SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
        `);

        // Add status column only if it doesn't exist
        const statusColumnExists = await queryRunner.query(`
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'people' 
            AND COLUMN_NAME = 'status'
        `);

        if (statusColumnExists[0].count === 0) {
            await queryRunner.query(`ALTER TABLE \`people\` ADD \`status\` enum ('ACTIVE', 'INACTIVE', 'REENTRY') NOT NULL DEFAULT 'INACTIVE'`);
        }

        await queryRunner.query(`ALTER TABLE \`cameras\` CHANGE \`id\` \`id\` char(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cameras\` DROP COLUMN \`institute_id\``);
        await queryRunner.query(`ALTER TABLE \`cameras\` ADD \`institute_id\` varchar(255) NULL`);

        // Add foreign keys
        await queryRunner.query(`ALTER TABLE \`contract_files\` ADD CONSTRAINT \`FK_004389a38fce6d7f1ba52017f45\` FOREIGN KEY (\`contract_id\`) REFERENCES \`contracts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_c590ff49418071be2be717d7744\` FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_68979013900fe56571594d823b4\` FOREIGN KEY (\`contract_type_id\`) REFERENCES \`contract_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_89bc26955009b3d1efd8592e61d\` FOREIGN KEY (\`area_id\`) REFERENCES \`areas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_2b1a7080bcc85a82a8140b784dd\` FOREIGN KEY (\`cargo_id\`) REFERENCES \`cargos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cameras\` ADD CONSTRAINT \`FK_db25b8774e1ffd3c7667ca49e12\` FOREIGN KEY (\`institute_id\`) REFERENCES \`institutes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD CONSTRAINT \`FK_b501722d73fa7794eb5e776d052\` FOREIGN KEY (\`camera_id\`) REFERENCES \`cameras\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`
            SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP FOREIGN KEY \`FK_b501722d73fa7794eb5e776d052\``);
        await queryRunner.query(`ALTER TABLE \`cameras\` DROP FOREIGN KEY \`FK_db25b8774e1ffd3c7667ca49e12\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_2b1a7080bcc85a82a8140b784dd\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_89bc26955009b3d1efd8592e61d\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_68979013900fe56571594d823b4\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_c590ff49418071be2be717d7744\``);
        await queryRunner.query(`ALTER TABLE \`contract_files\` DROP FOREIGN KEY \`FK_004389a38fce6d7f1ba52017f45\``);
        await queryRunner.query(`ALTER TABLE \`cameras\` DROP COLUMN \`institute_id\``);
        await queryRunner.query(`ALTER TABLE \`cameras\` ADD \`institute_id\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`cameras\` CHANGE \`id\` \`id\` char(36) NOT NULL DEFAULT 'uuid()'`);
        await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD CONSTRAINT \`FK_incidents_camera\` FOREIGN KEY (\`camera_id\`) REFERENCES \`cameras\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cameras\` ADD CONSTRAINT \`FK_cameras_institute\` FOREIGN KEY (\`institute_id\`) REFERENCES \`institutes\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}
