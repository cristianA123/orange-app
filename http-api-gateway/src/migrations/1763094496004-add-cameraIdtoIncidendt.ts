import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCameraIdtoIncidendt1763094496004 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`incidents\`
            ADD COLUMN \`camera_id\` char(36) NULL;
        `);

    await queryRunner.query(`
            ALTER TABLE \`incidents\`
            ADD CONSTRAINT \`FK_incidents_camera\`
            FOREIGN KEY (\`camera_id\`) REFERENCES \`cameras\`(\`id\`)
            ON DELETE SET NULL
            ON UPDATE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`incidents\`
            DROP FOREIGN KEY \`FK_incidents_camera\`;
        `);

    await queryRunner.query(`
            ALTER TABLE \`incidents\`
            DROP COLUMN \`camera_id\`;
        `);
  }

}
