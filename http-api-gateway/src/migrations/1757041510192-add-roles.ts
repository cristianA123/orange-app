import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoles1757041510192 implements MigrationInterface {
    name = 'AddRoles1757041510192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`rol\` \`rol\` enum ('SUPERADMIN', 'USER', 'EMPLOYEE') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`rol\` \`rol\` enum ('SUPERADMIN', 'ADMIN', 'DISPATCHER') NOT NULL`);
    }

}
