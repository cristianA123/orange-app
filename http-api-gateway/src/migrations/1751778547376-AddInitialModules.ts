import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInitialModules1751778547376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const securityId = 'c4e4a6c4-5c91-41b1-b4c4-41324a39a621';
    const enforcementId = '996dcfc0-a23e-4ca9-ba46-559cc1933fb8';
    const transportId = '311f8e30-caef-4f42-a5dc-fe13631b25d7';
    const riskId = 'edd73ee5-d47e-43bf-ac8f-c6610ff77bf4';

    const incidentsId = '6ce4d2b1-23b1-43a7-a5c3-70d14027c630';
    const heatmapId = '968544f0-4156-40c5-ab2e-67139b0ac783';
    const databaseId = '0c0772af-2e99-484a-ad32-5b2bf1d55a01';
    const statisticsId = '0a79bd01-b6f5-4df1-bebc-961085076ef4';

    await queryRunner.query(`
      INSERT INTO modules (id, name, path, slog, is_main_module, parent_id, created_at, updated_at)
      VALUES
        ('${securityId}', 'SERENAZGO - CCO', '/security', 'security', true, NULL, NOW(), NOW()),
        ('${enforcementId}', 'FISCALIZACION', '/enforcement', 'enforcement', true, NULL, NOW(), NOW()),
        ('${transportId}', 'TRANSPORTE', '/transport', 'transport', true, NULL, NOW(), NOW()),
        ('${riskId}', 'RIESGO', '/risk', 'risk', true, NULL, NOW(), NOW()),

        ('${incidentsId}', 'REPORTES DE INCIDENCIAS', '/security/incidents', 'incidents', false, '${securityId}', NOW(), NOW()),
        ('${heatmapId}', 'MAPA DE CALOR', '/security/heatmap', 'heatmap', false, '${securityId}', NOW(), NOW()),
        ('${databaseId}', 'BASE DE DATOS – CAPTURADOS', '/security/database', 'database', false, '${securityId}', NOW(), NOW()),
        ('${statisticsId}', 'ESTADISTICAS GRAFICAS', '/security/statistics', 'statistics', false, '${securityId}', NOW(), NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM modules WHERE slog IN (
        'serenazgo', 'fiscalizacion', 'transporte', 'riesgo',
        'reportes', 'mapa-calor', 'base-datos', 'estadisticas'
      );
    `);
  }
}
