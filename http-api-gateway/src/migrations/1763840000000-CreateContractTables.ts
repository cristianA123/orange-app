import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * NO-OP: esta migración se generó en paralelo con
 * `1763839426901-add-table-contact` y crea exactamente las mismas tablas
 * (contract_types, areas, contracts, contract_files). Dejarla activa provoca
 * `ER_TABLE_EXISTS_ERROR`.
 *
 * Se deja como no-op para que:
 * - entornos nuevos la registren en `migrations` sin ejecutar SQL;
 * - entornos donde ya corrió no vuelvan a ejecutarla.
 *
 * No borrar del repo mientras otros entornos tengan su nombre en la tabla
 * `migrations` como "aplicada".
 */
export class CreateContractTables1763840000000 implements MigrationInterface {
  name = 'CreateContractTables1763840000000'

  public async up(_queryRunner: QueryRunner): Promise<void> {
    // intentionally blank (see file comment)
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // intentionally blank (see file comment)
  }
}
