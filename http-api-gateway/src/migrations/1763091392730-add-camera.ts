import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCamera1763091392730 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          CREATE TABLE \`cameras\` (
             \`id\` char(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
             \`camera_number\` varchar(255) NOT NULL,
             \`latitude\` decimal(10,6) NOT NULL,
             \`longitude\` decimal(10,6) NOT NULL,
             \`address\` varchar(255) NOT NULL,
             \`status\` ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DISCONNECTED') NOT NULL,
             \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
             \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
             \`deleted_at\` datetime(6) NULL
          )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`cameras\``);
    await queryRunner.query(`DROP TYPE \`cameras_status_enum\``);
  }
}
