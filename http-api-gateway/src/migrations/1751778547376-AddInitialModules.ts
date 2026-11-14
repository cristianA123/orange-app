import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * NO-OP: originalmente insertaba los módulos iniciales (SERENAZGO, TRANSPORTE,
 * FISCALIZACION, RIESGO + hijos) con UUIDs fijos. Esos módulos ahora los
 * siembra el seed de dev (`src/seeds/modules.seed.ts`), con otros UUIDs fijos
 * definidos en `src/seeds/constants.ts` → `DEV_MODULE_IDS`.
 *
 * No borrar del repo mientras entornos existentes tengan su nombre en la tabla
 * `migrations` como "aplicada". En entornos nuevos TypeORM la registra como
 * aplicada sin ejecutar SQL. Para poblar la DB, correr `npm run seed:dev`.
 */
export class AddInitialModules1751778547376 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // intentionally blank (see file comment)
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // intentionally blank (see file comment)
  }
}
