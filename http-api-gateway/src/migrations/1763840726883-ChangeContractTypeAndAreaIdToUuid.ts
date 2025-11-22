import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeContractTypeAndAreaIdToUuid1763840726883 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Drop foreign keys referencing contract_types and areas
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_68979013900fe56571594d823b4\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_89bc26955009b3d1efd8592e61d\``);

        // 2. Truncate tables (since we are changing ID type, existing data is invalid)
        await queryRunner.query(`TRUNCATE TABLE \`contract_types\``);
        await queryRunner.query(`TRUNCATE TABLE \`areas\``);

        // 3. Alter columns to UUID (char(36))
        await queryRunner.query(`ALTER TABLE \`contract_types\` MODIFY \`id\` char(36) NOT NULL DEFAULT (UUID())`);
        await queryRunner.query(`ALTER TABLE \`areas\` MODIFY \`id\` char(36) NOT NULL DEFAULT (UUID())`);

        // 4. Update contracts table columns to match UUID type
        await queryRunner.query(`ALTER TABLE \`contracts\` MODIFY \`contract_type_id\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`contracts\` MODIFY \`area_id\` char(36) NULL`);

        // 5. Re-add foreign keys
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_68979013900fe56571594d823b4\` FOREIGN KEY (\`contract_type_id\`) REFERENCES \`contract_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_89bc26955009b3d1efd8592e61d\` FOREIGN KEY (\`area_id\`) REFERENCES \`areas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // 6. Seed Data with UUIDs (letting DB generate them or inserting specific ones if needed, but here we insert names and let DB generate UUIDs)
        await queryRunner.query(`
            INSERT INTO \`contract_types\` (\`name\`) VALUES 
            ('CAS 1057'),
            ('728'),
            ('276'),
            ('CONTRATACION DE SERVICIOS');
        `);

        await queryRunner.query(`
            INSERT INTO \`areas\` (\`name\`) VALUES 
            ('SERENAZGO SERVICIO DE CAMPO'),
            ('CENTRO DE CONTROL DE OPERACIONES'),
            ('RPAS'),
            ('OBSERVATORIO'),
            ('ADMINISTRACION'),
            ('PLANTA EXTERNA');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert changes is complex here due to ID type change. 
        // Ideally we would drop and recreate as INT, but for this dev task we can just drop the FKs and tables.
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_68979013900fe56571594d823b4\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_89bc26955009b3d1efd8592e61d\``);

        // Revert columns to INT (this will fail if there are UUIDs, so we truncate first)
        await queryRunner.query(`TRUNCATE TABLE \`contract_types\``);
        await queryRunner.query(`TRUNCATE TABLE \`areas\``);

        await queryRunner.query(`ALTER TABLE \`contract_types\` MODIFY \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`areas\` MODIFY \`id\` int NOT NULL AUTO_INCREMENT`);

        await queryRunner.query(`ALTER TABLE \`contracts\` MODIFY \`contract_type_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`contracts\` MODIFY \`area_id\` int NULL`);

        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_68979013900fe56571594d823b4\` FOREIGN KEY (\`contract_type_id\`) REFERENCES \`contract_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_89bc26955009b3d1efd8592e61d\` FOREIGN KEY (\`area_id\`) REFERENCES \`areas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
