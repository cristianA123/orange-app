import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class AddInitialInstituteAndUser1751151835063
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const instituteId = uuidv4();
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash('123456', 10);

    await queryRunner.query(`
      INSERT INTO institutes (
        id,
        name,
        img,
        address,
        status,
        created_at,
        updated_at
      ) VALUES (
        '${instituteId}',
        'Instituto Central',
        'default.png',
        'Calle Falsa 123',
        '1',
        NOW(),
        NOW()
      )
    `);

    await queryRunner.query(`
      INSERT INTO users (
        id,
        institute_id,
        name,
        email,
        password,
        identifier,
        status,
        rol,
        created_at,
        updated_at
      ) VALUES (
        '${userId}',
        '${instituteId}',
        'David Esteban',
        'dm7659746@gmail.com',
        '${hashedPassword}',
        'ID001',
        '1',
        'SUPERADMIN',
        NOW(),
        NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE email = 'dm7659746@gmail.com'
    `);

    await queryRunner.query(`
      DELETE FROM institutes WHERE name = 'Instituto Central'
    `);
  }
}
