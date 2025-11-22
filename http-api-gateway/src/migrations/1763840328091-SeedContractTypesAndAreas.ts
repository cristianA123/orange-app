import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedContractTypesAndAreas1763840328091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Seed Contract Types
        await queryRunner.query(`
            INSERT INTO \`contract_types\` (\`name\`) VALUES 
            ('CAS 1057'),
            ('728'),
            ('276'),
            ('CONTRATACION DE SERVICIOS');
        `);

        // Seed Areas
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
        // Remove Seeded Data
        await queryRunner.query(`DELETE FROM \`contract_types\` WHERE \`name\` IN ('CAS 1057', '728', '276', 'CONTRATACION DE SERVICIOS')`);
        await queryRunner.query(`DELETE FROM \`areas\` WHERE \`name\` IN ('SERENAZGO SERVICIO DE CAMPO', 'CENTRO DE CONTROL DE OPERACIONES', 'RPAS', 'OBSERVATORIO', 'ADMINISTRACION', 'PLANTA EXTERNA')`);
    }

}
