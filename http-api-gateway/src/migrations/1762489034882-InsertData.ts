// src/migration/InsertReferenceData.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class InsertData1762489034882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insertar Nacionalidades usando UUIDs generados en JavaScript
    const nationalities = [
      'Argentino',
      'Boliviano',
      'Brasileño',
      'Chileno',
      'Colombiano',
      'Ecuatoriano',
      'Peruano',
      'Venezolano',
      'Uruguayo',
      'Otro',
    ];

    for (const name of nationalities) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO nationalities (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }

    // Insertar Estados Civiles
    const maritalStatuses = [
      'SOLTERO',
      'CASADO',
      'SEPARADO',
      'DIVORCIADO',
      'CONVIVIENTE',
      'VIUDO',
    ];

    for (const name of maritalStatuses) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO marital_statuses (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }

    // Insertar Procedencias
    const origins = ['BOMBEROS', 'CIVIL', 'FFAA', 'OTROS', 'PNP'];
    for (const name of origins) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO origins (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }

    // Insertar Sistemas de Pensiones
    const pensionSystems = [
      'AFP HORIZONTE',
      'AFP INTEGRA',
      'AFP PRIMA',
      'AFP PROFUTURO',
      'SIST. NAC. PENSION',
      'AFP HABITAT',
      'CAJA MILPOL',
      'NINGUNO',
    ];

    for (const name of pensionSystems) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO pension_systems (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }

    // Insertar Licencias A
    const licensesA = [
      'LICENCIA A-I',
      'LICENCIA A-IIA',
      'LICENCIA A-IIB',
      'LICENCIA A-IIIA',
      'LICENCIA A-IIIB',
      'LICENCIA A-IIIC',
    ];

    for (const name of licensesA) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO licenses_a (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }

    // Insertar Licencias B
    const licensesB = [
      'LICENCIA B-I',
      'LICENCIA B-IIA',
      'LICENCIA B-IIB',
      'LICENCIA B-IIC',
      'LICENCIAS DE CLASE B',
    ];

    for (const name of licensesB) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO licenses_b (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }

    // Insertar Niveles de Estudio
    const educationLevels = [
      'PRIMARIA - COMPLETA',
      'PRIMARIA - INCOMPLETA',
      'SECUNDARIA - COMPLETA',
      'SECUNDARIA - INCOMPLETA',
      'TECNICO - INCOMPLETO',
      'TECNICO - ESTUDIANTE',
      'TECNICO - EGRESADO',
      'TECNICO - TITULADO',
      'UNIVERSIDAD INCOMPLETA',
      'UNIVERSIDAD - ESTUDIANTE',
    ];

    for (const name of educationLevels) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO education_levels (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }

    // Insertar Grupos Sanguíneos
    const bloodTypes = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];
    for (const name of bloodTypes) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO blood_types (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }

    // Insertar Tipos de Contacto de Emergencia
    const emergencyContacts = [
      'CÓNYUGE',
      'HERMANA',
      'HERMANO',
      'MADRE',
      'OTROS',
      'PADRE',
    ];

    for (const name of emergencyContacts) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO emergency_contact_types (id, name, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
        [id, name],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar todos los datos insertados
    await queryRunner.query(`DELETE FROM emergency_contact_types`);
    await queryRunner.query(`DELETE FROM blood_types`);
    await queryRunner.query(`DELETE FROM education_levels`);
    await queryRunner.query(`DELETE FROM licenses_b`);
    await queryRunner.query(`DELETE FROM licenses_a`);
    await queryRunner.query(`DELETE FROM pension_systems`);
    await queryRunner.query(`DELETE FROM origins`);
    await queryRunner.query(`DELETE FROM marital_statuses`);
    await queryRunner.query(`DELETE FROM nationalities`);
  }
}
