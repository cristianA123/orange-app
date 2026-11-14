import * as bcrypt from 'bcrypt';
import { QueryRunner } from 'typeorm';
import { DEV_INSTITUTE_IDS, DEV_PASSWORD, DEV_USER_IDS } from './constants';

type UserStatus = '1' | '2' | '3' | '4' | '5'; // ACTIVE | INACTIVE | PENDING | SUSPENDED | DELETED
type UserRole = 'SUPERADMIN' | 'USER' | 'EMPLOYEE';

interface UserSeed {
  id: string;
  institute_id: string;
  name: string;
  lastName: string;
  email: string;
  identifier: string;
  rol: UserRole;
  status: UserStatus;
}

const USERS: UserSeed[] = [
  {
    id: DEV_USER_IDS.superAdmin,
    institute_id: DEV_INSTITUTE_IDS.limaCentro,
    name: 'Super',
    lastName: 'Admin',
    email: 'superadmin@orange.dev',
    identifier: 'SA-0001',
    rol: 'SUPERADMIN',
    status: '1',
  },
  {
    id: DEV_USER_IDS.adminLima,
    institute_id: DEV_INSTITUTE_IDS.limaCentro,
    name: 'Ana',
    lastName: 'García',
    email: 'admin.lima@orange.dev',
    identifier: 'LIM-ADM-01',
    rol: 'USER',
    status: '1',
  },
  {
    id: DEV_USER_IDS.operadorLima,
    institute_id: DEV_INSTITUTE_IDS.limaCentro,
    name: 'Carlos',
    lastName: 'Ramírez',
    email: 'operador.lima@orange.dev',
    identifier: 'LIM-OP-01',
    rol: 'EMPLOYEE',
    status: '1',
  },
  {
    id: DEV_USER_IDS.seguridadLima,
    institute_id: DEV_INSTITUTE_IDS.limaCentro,
    name: 'Rosa',
    lastName: 'Vargas',
    email: 'seguridad.lima@orange.dev',
    identifier: 'LIM-SEC-01',
    rol: 'EMPLOYEE',
    status: '1',
  },
  {
    id: DEV_USER_IDS.inactivoLima,
    institute_id: DEV_INSTITUTE_IDS.limaCentro,
    name: 'Jorge',
    lastName: 'Mendoza',
    email: 'inactivo.lima@orange.dev',
    identifier: 'LIM-INA-01',
    rol: 'USER',
    status: '2', // INACTIVE
  },
  {
    id: DEV_USER_IDS.adminMiraflores,
    institute_id: DEV_INSTITUTE_IDS.miraflores,
    name: 'Lucía',
    lastName: 'Fernández',
    email: 'admin.miraflores@orange.dev',
    identifier: 'MIR-ADM-01',
    rol: 'USER',
    status: '1',
  },
  {
    id: DEV_USER_IDS.operadorMiraflores,
    institute_id: DEV_INSTITUTE_IDS.miraflores,
    name: 'Diego',
    lastName: 'Castro',
    email: 'operador.miraflores@orange.dev',
    identifier: 'MIR-OP-01',
    rol: 'EMPLOYEE',
    status: '1',
  },
];

export async function seedUsers(runner: QueryRunner): Promise<void> {
  const hashedPassword = await bcrypt.hash(DEV_PASSWORD, 10);

  for (const u of USERS) {
    await runner.query(
      `INSERT INTO users
         (id, institute_id, name, lastName, email, password, identifier, status, rol)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         institute_id = VALUES(institute_id),
         name = VALUES(name),
         lastName = VALUES(lastName),
         email = VALUES(email),
         password = VALUES(password),
         identifier = VALUES(identifier),
         status = VALUES(status),
         rol = VALUES(rol)`,
      [
        u.id,
        u.institute_id,
        u.name,
        u.lastName,
        u.email,
        hashedPassword,
        u.identifier,
        u.status,
        u.rol,
      ],
    );
  }
  console.log(`  users: ${USERS.length} upserted (password: "${DEV_PASSWORD}")`);
}
