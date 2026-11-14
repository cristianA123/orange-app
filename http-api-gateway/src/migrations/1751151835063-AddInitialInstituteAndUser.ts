import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * NO-OP: originalmente insertaba un instituto "Instituto Central" + un usuario
 * SUPERADMIN con UUIDs generados en runtime. Los datos de desarrollo ahora
 * viven en `src/seeds/` (ver `docs/playbooks/manage-seeds.md`), con UUIDs
 * fijos para que Bruno los referencie de forma estable.
 *
 * No borrar del repo mientras entornos existentes tengan su nombre en la tabla
 * `migrations` como "aplicada". En entornos nuevos TypeORM la registra como
 * aplicada sin ejecutar SQL. Para poblar la DB, correr `npm run seed:dev`.
 */
export class AddInitialInstituteAndUser1751151835063
  implements MigrationInterface
{
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // intentionally blank (see file comment)
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // intentionally blank (see file comment)
  }
}
