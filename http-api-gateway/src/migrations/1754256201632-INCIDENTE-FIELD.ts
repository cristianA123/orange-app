import { MigrationInterface, QueryRunner } from "typeorm";

export class INCIDENTEFIELD1754256201632 implements MigrationInterface {
    name = 'INCIDENTEFIELD1754256201632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`attention_date\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`camera_number\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`closing_date\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`document_number\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`form_type\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`is_relevant\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`location_lat\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`location_lng\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`officer_name\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`phone_number\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`sender_name\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`locationLat\` decimal(10,6) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`locationLng\` decimal(10,6) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`formType\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`officerName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`phoneNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`senderName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`cameraNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`documentNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`attentionDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`closingDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`isRelevant\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`isRelevant\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`closingDate\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`attentionDate\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`documentNumber\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`cameraNumber\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`senderName\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`phoneNumber\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`officerName\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`formType\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`locationLng\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` DROP COLUMN \`locationLat\``);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`sender_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`phone_number\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`officer_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`location_lng\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`location_lat\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`is_relevant\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`form_type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`document_number\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`closing_date\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`camera_number\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`incidents\` ADD \`attention_date\` timestamp NULL`);
    }

}
