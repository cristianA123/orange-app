import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCargosData1762621315261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO cargos (id, name, source) VALUES
      (UUID(), 'SERENO A PIE', 'CAMPO'),
      (UUID(), 'SERENO CHOFER', 'CAMPO'),
      (UUID(), 'SERENO MOTO', 'CAMPO'),
      (UUID(), 'SERENO GIR', 'CAMPO'),
      (UUID(), 'SERENO CUATRIMOTO', 'CAMPO'),
      (UUID(), 'SERENO DATOS', 'VIDEOVIGILANCIA'),
      (UUID(), 'SERENO OPERADOR DE CAMARAS', 'VIDEOVIGILANCIA'),
      (UUID(), 'SERENO RPAS', 'VIDEOVIGILANCIA'),
      (UUID(), 'SERENO OPERADOR DE RADIO', NULL),
      (UUID(), 'SERENO OPERADOR DE COMUNICACIONES', 'MENSAJE/LLAMADAS WHATSAPP/TLF FIJO'),
      (UUID(), 'TECNICO PLANTA EXTERNA', NULL),
      (UUID(), 'ASISTENTE ADMINISTRATIVO', NULL),
      (UUID(), 'AUXILIAR ADMINISTRATIVO', NULL),
      (UUID(), 'ABOGADO', NULL),
      (UUID(), 'ESPECIALISTA ADMINISTRATIVO', NULL),
      (UUID(), 'SECRETARIA', NULL),
      (UUID(), 'SUPERVISOR CAMPO', 'ORDEN DIRECTA'),
      (UUID(), 'SUPERVISOR CCO', 'ORDEN DIRECTA'),
      (UUID(), 'SUPERVISOR RPAS', 'ORDEN DIRECTA'),
      (UUID(), 'SUPERVISOR PLANTA EXTERNA', 'ORDEN DIRECTA'),
      (UUID(), 'PROMOTOR', NULL),
      (UUID(), 'TECNICO ESTADISTICO', NULL),
      (UUID(), 'JEFE OBSERVATORIO', 'ORDEN DIRECTA'),
      (UUID(), 'JEFE DE OPERACIONES', 'ORDEN DIRECTA'),
      (UUID(), 'JEFE DEL CENTRO DE CONTROL DE OPERACIONES', 'ORDEN DIRECTA');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM cargos WHERE name IN (
        'SERENO A PIE',
        'SERENO CHOFER',
        'SERENO MOTO',
        'SERENO GIR',
        'SERENO CUATRIMOTO',
        'SERENO DATOS',
        'SERENO OPERADOR DE CAMARAS',
        'SERENO RPAS',
        'SERENO OPERADOR DE RADIO',
        'SERENO OPERADOR DE COMUNICACIONES',
        'TECNICO PLANTA EXTERNA',
        'ASISTENTE ADMINISTRATIVO',
        'AUXILIAR ADMINISTRATIVO',
        'ABOGADO',
        'ESPECIALISTA ADMINISTRATIVO',
        'SECRETARIA',
        'SUPERVISOR CAMPO',
        'SUPERVISOR CCO',
        'SUPERVISOR RPAS',
        'SUPERVISOR PLANTA EXTERNA',
        'PROMOTOR',
        'TECNICO ESTADISTICO',
        'JEFE OBSERVATORIO',
        'JEFE DE OPERACIONES',
        'JEFE DEL CENTRO DE CONTROL DE OPERACIONES'
      );
    `);
  }
}
