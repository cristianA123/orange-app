import { QueryRunner } from 'typeorm';
import { DEV_INSTITUTE_IDS } from './constants';

type InstituteStatus = '1' | '2' | '3' | '4'; // ACTIVE | INACTIVE | PENDING | SUSPENDED

interface InstituteSeed {
  id: string;
  name: string;
  ruc: string;
  address: string;
  status: InstituteStatus;
}

const INSTITUTES: InstituteSeed[] = [
  {
    id: DEV_INSTITUTE_IDS.limaCentro,
    name: 'Municipalidad de Lima Centro',
    ruc: '20131380951',
    address: 'Jr. de la Unión 300, Lima',
    status: '1',
  },
  {
    id: DEV_INSTITUTE_IDS.miraflores,
    name: 'Municipalidad de Miraflores',
    ruc: '20131378925',
    address: 'Av. Larco 400, Miraflores',
    status: '1',
  },
  {
    id: DEV_INSTITUTE_IDS.sanIsidro,
    name: 'Municipalidad de San Isidro',
    ruc: '20131378933',
    address: 'Av. Las Begonias 500, San Isidro',
    status: '3', // PENDING — útil para probar flujos de activación
  },
];

export async function seedInstitutes(runner: QueryRunner): Promise<void> {
  for (const i of INSTITUTES) {
    await runner.query(
      `INSERT INTO institutes (id, name, img, address, status, ruc)
       VALUES (?, ?, 'default.png', ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         address = VALUES(address),
         status = VALUES(status),
         ruc = VALUES(ruc)`,
      [i.id, i.name, i.address, i.status, i.ruc],
    );
  }
  console.log(`  institutes: ${INSTITUTES.length} upserted`);
}
