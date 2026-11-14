/**
 * IDs fijos de los datos de desarrollo. Al ser deterministas, los requests de
 * Bruno los referencian directamente (ej. `{{limaCentroInstituteId}}`) sin
 * tener que recopiar UUIDs cada vez que se resetea la DB.
 *
 * Convención: el primer carácter del primer segmento indica el tipo.
 *   1xxxxxxx -> instituto
 *   2xxxxxxx -> usuario
 *   3xxxxxxx -> módulo
 */

export const DEV_INSTITUTE_IDS = {
  limaCentro: '11111111-1111-1111-1111-111111110001',
  miraflores: '11111111-1111-1111-1111-111111110002',
  sanIsidro: '11111111-1111-1111-1111-111111110003',
};

export const DEV_USER_IDS = {
  superAdmin: '22222222-2222-2222-2222-222222220001',
  adminLima: '22222222-2222-2222-2222-222222220002',
  operadorLima: '22222222-2222-2222-2222-222222220003',
  seguridadLima: '22222222-2222-2222-2222-222222220004',
  inactivoLima: '22222222-2222-2222-2222-222222220005',
  adminMiraflores: '22222222-2222-2222-2222-222222220006',
  operadorMiraflores: '22222222-2222-2222-2222-222222220007',
};

export const DEV_MODULE_IDS = {
  security: '33333333-3333-3333-3333-333333330001',
  securityIncidents: '33333333-3333-3333-3333-333333330002',
  securityHeatmap: '33333333-3333-3333-3333-333333330003',
  securityDatabase: '33333333-3333-3333-3333-333333330004',
  securityStatistics: '33333333-3333-3333-3333-333333330005',
  transport: '33333333-3333-3333-3333-333333330006',
  enforcement: '33333333-3333-3333-3333-333333330007',
  risk: '33333333-3333-3333-3333-333333330008',
};

/** Password en claro para TODOS los usuarios de dev. */
export const DEV_PASSWORD = 'password123';
