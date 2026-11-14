import { QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  DEV_INSTITUTE_IDS,
  DEV_MODULE_IDS,
  DEV_USER_IDS,
} from './constants';

interface ModuleSeed {
  id: string;
  name: string;
  path: string;
  slog: string;
  is_main_module: boolean;
  parent_id: string | null;
}

const MODULES: ModuleSeed[] = [
  // Padres
  { id: DEV_MODULE_IDS.security,     name: 'SERENAZGO - CCO',        path: '/security',            slog: 'security',    is_main_module: true,  parent_id: null },
  { id: DEV_MODULE_IDS.transport,    name: 'TRANSPORTE',             path: '/transport',           slog: 'transport',   is_main_module: true,  parent_id: null },
  { id: DEV_MODULE_IDS.enforcement,  name: 'FISCALIZACION',          path: '/enforcement',         slog: 'enforcement', is_main_module: true,  parent_id: null },
  { id: DEV_MODULE_IDS.risk,         name: 'RIESGO',                 path: '/risk',                slog: 'risk',        is_main_module: true,  parent_id: null },
  // Hijos de SERENAZGO
  { id: DEV_MODULE_IDS.securityIncidents,  name: 'REPORTES DE INCIDENCIAS',    path: '/security/incidents',  slog: 'incidents',   is_main_module: false, parent_id: DEV_MODULE_IDS.security },
  { id: DEV_MODULE_IDS.securityHeatmap,    name: 'MAPA DE CALOR',              path: '/security/heatmap',    slog: 'heatmap',     is_main_module: false, parent_id: DEV_MODULE_IDS.security },
  { id: DEV_MODULE_IDS.securityDatabase,   name: 'BASE DE DATOS - CAPTURADOS', path: '/security/database',   slog: 'database',    is_main_module: false, parent_id: DEV_MODULE_IDS.security },
  { id: DEV_MODULE_IDS.securityStatistics, name: 'ESTADISTICAS GRAFICAS',      path: '/security/statistics', slog: 'statistics',  is_main_module: false, parent_id: DEV_MODULE_IDS.security },
];

// Instituto → módulos
const INSTITUTE_MODULE_ASSIGNMENTS: Array<{ instituteId: string; moduleIds: string[] }> = [
  {
    instituteId: DEV_INSTITUTE_IDS.limaCentro,
    moduleIds: Object.values(DEV_MODULE_IDS), // todos
  },
  {
    instituteId: DEV_INSTITUTE_IDS.miraflores,
    moduleIds: [
      DEV_MODULE_IDS.security,
      DEV_MODULE_IDS.securityIncidents,
      DEV_MODULE_IDS.securityHeatmap,
    ],
  },
  // sanIsidro (PENDING): sin módulos hasta activación
];

// Usuario → módulos
const USER_MODULE_ASSIGNMENTS: Array<{ userId: string; moduleIds: string[] }> = [
  {
    userId: DEV_USER_IDS.superAdmin,
    moduleIds: Object.values(DEV_MODULE_IDS),
  },
  {
    userId: DEV_USER_IDS.adminLima,
    moduleIds: Object.values(DEV_MODULE_IDS),
  },
  {
    userId: DEV_USER_IDS.operadorLima,
    moduleIds: [
      DEV_MODULE_IDS.security,
      DEV_MODULE_IDS.securityIncidents,
      DEV_MODULE_IDS.securityHeatmap,
    ],
  },
  {
    userId: DEV_USER_IDS.seguridadLima,
    moduleIds: [
      DEV_MODULE_IDS.security,
      DEV_MODULE_IDS.securityIncidents,
    ],
  },
  {
    userId: DEV_USER_IDS.adminMiraflores,
    moduleIds: [
      DEV_MODULE_IDS.security,
      DEV_MODULE_IDS.securityIncidents,
      DEV_MODULE_IDS.securityHeatmap,
    ],
  },
  {
    userId: DEV_USER_IDS.operadorMiraflores,
    moduleIds: [
      DEV_MODULE_IDS.security,
      DEV_MODULE_IDS.securityIncidents,
    ],
  },
];

export async function seedModules(runner: QueryRunner): Promise<void> {
  // 1) upsert módulos
  for (const m of MODULES) {
    await runner.query(
      `INSERT INTO modules (id, name, path, slog, is_main_module, parent_id)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         path = VALUES(path),
         slog = VALUES(slog),
         is_main_module = VALUES(is_main_module),
         parent_id = VALUES(parent_id)`,
      [m.id, m.name, m.path, m.slog, m.is_main_module ? 1 : 0, m.parent_id],
    );
  }

  // 2) reset + reinsert asignaciones de instituto
  for (const a of INSTITUTE_MODULE_ASSIGNMENTS) {
    await runner.query(`DELETE FROM institute_modules WHERE institute_id = ?`, [a.instituteId]);
    for (const moduleId of a.moduleIds) {
      await runner.query(
        `INSERT INTO institute_modules (id, institute_id, module_id) VALUES (?, ?, ?)`,
        [uuidv4(), a.instituteId, moduleId],
      );
    }
  }

  // 3) reset + reinsert asignaciones de usuario
  for (const a of USER_MODULE_ASSIGNMENTS) {
    await runner.query(`DELETE FROM user_modules WHERE user_id = ?`, [a.userId]);
    for (const moduleId of a.moduleIds) {
      await runner.query(
        `INSERT INTO user_modules (id, user_id, module_id) VALUES (?, ?, ?)`,
        [uuidv4(), a.userId, moduleId],
      );
    }
  }

  console.log(
    `  modules: ${MODULES.length} upserted, ` +
    `${INSTITUTE_MODULE_ASSIGNMENTS.length} institute assignments, ` +
    `${USER_MODULE_ASSIGNMENTS.length} user assignments`,
  );
}
