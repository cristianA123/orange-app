import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddInstituteIdToCamera1763095742592 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE \`cameras\`
            ADD COLUMN \`institute_id\` char(36) NULL;
    `);

    await queryRunner.query(`
        ALTER TABLE \`cameras\`
            ADD CONSTRAINT \`FK_cameras_institute\`
                FOREIGN KEY (\`institute_id\`) REFERENCES \`institutes\`(\`id\`)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE \`cameras\`
        DROP FOREIGN KEY \`FK_cameras_institute\`;
    `);

    await queryRunner.query(`
        ALTER TABLE \`cameras\`
        DROP COLUMN \`institute_id\`;
    `);
  }

}
