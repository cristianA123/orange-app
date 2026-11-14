import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * NO-OP: generada en paralelo con `1763839426901-add-table-contact`. El
 * contenido duplica los FKs de `contracts`/`contract_files` que esa migración
 * ya crea. Además alteraba `cameras.id`, `cameras.institute_id` y agregaba el
 * FK `cameras -> institutes` + `incidents -> cameras` — pero esos cambios ya
 * están cubiertos por migraciones anteriores (`add-camera`, `add-cameraIdtoIncidendt`,
 * `addInstituteIdToCamera`). Dejarla activa provoca errores de FK duplicado.
 *
 * Se deja como no-op. Si en el futuro hace falta alguno de los ALTER que tenía
 * (por ejemplo re-asegurar un FK), crear una migración nueva explícita en vez
 * de reactivar esta.
 */
export class TableContract1763840071805 implements MigrationInterface {
    name = 'TableContract1763840071805'

    public async up(_queryRunner: QueryRunner): Promise<void> {
        // intentionally blank (see file comment)
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        // intentionally blank (see file comment)
    }
}
