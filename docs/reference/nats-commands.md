# Referencia: comandos NATS

Catálogo de todos los `cmd` que viajan por NATS, agrupados por el **módulo del gateway** que los origina. El micro que los atiende tiene un `@MessagePattern({ cmd: 'XXX' })` con el mismo string.

> Generado por `grep -rhoE "cmd: '[A-Za-z_]+'" http-api-gateway/src/modules/ | sort -u`. Mantener manualmente al agregar endpoints.

## auth

| cmd            | Atendido por          | Propósito                                        |
| -------------- | --------------------- | ------------------------------------------------ |
| `AUTH_LOGIN`   | users-microservice    | Validar email+password y emitir access+refresh.  |
| `AUTH_REFRESH` | users-microservice    | Rotar access token usando refresh token.         |

> Nota: `VERIFY_TOKEN` (string, no `{cmd}`) también vive en users-microservice y lo consume el `NatsAuthGuard` del gateway.

## users

| cmd                                 | Atendido por        | Propósito                                       |
| ----------------------------------- | ------------------- | ----------------------------------------------- |
| `createUser` *(legacy camelCase)*   | users-microservice  | Crear usuario (registro público).               |
| `CREATE_USER_STAFF`                 | users-microservice  | Crear usuario de staff bajo el instituto actual.|
| `UPDATE_USER`                       | users-microservice  | Actualizar usuario.                             |
| `UPDATE_USER_STAFF`                 | users-microservice  | Actualizar staff.                               |
| `DELETE_USER`                       | users-microservice  | Borrar usuario.                                 |
| `GET_USER`                          | users-microservice  | Obtener por ID.                                 |
| `GET_USERS`                         | users-microservice  | Listar todos.                                   |
| `GET_USER_BY_INSTITUTE_ID`          | users-microservice  | Listar usuarios de un instituto.                |
| `GET_USER_SECURITY_BY_INSTITUTE_ID` | users-microservice  | Listar usuarios "security" de un instituto.     |
| `FIND_USER_ID_NAME_DNI`             | users-microservice  | Resumen id+nombre+DNI (dropdowns).              |
| `CHANGE_PASSWORD`                   | users-microservice  | Cambio de contraseña.                           |

## institute

| cmd                        | Atendido por             | Propósito                               |
| -------------------------- | ------------------------ | --------------------------------------- |
| `CREATE_INSTITUTE`         | institute-microservice   | Alta de instituto (tenant).             |
| `UPDATE_INSTITUTE`         | institute-microservice   | Actualizar instituto.                   |
| `DELETE_INSTITUTE`         | institute-microservice   | Borrar instituto.                       |
| `GET_INSTITUTE`            | institute-microservice   | Obtener por ID.                         |
| `GET_INSTITUTES`           | institute-microservice   | Listar.                                 |
| `GET_INSTITUTE_USERS`      | institute-microservice   | Usuarios del instituto.                 |

## modules (permisos)

| cmd                          | Atendido por          | Propósito                                    |
| ---------------------------- | --------------------- | -------------------------------------------- |
| `GET_MODULES`                | modules-microservice  | Listar módulos disponibles.                  |
| `GET_MODULES_BY_INSTITUTE`   | modules-microservice  | Módulos habilitados para un instituto.       |
| `GET_MODULES_BY_USER`        | modules-microservice  | Módulos habilitados para un usuario.         |
| `GET_USER_MODULES`           | modules-microservice  | Módulos de un usuario (alt. del anterior).   |
| `SYNC_INSTITUTE_MODULES`     | modules-microservice  | Reemplazar lista completa para instituto.    |
| `SYNC_USER_MODULES`          | modules-microservice  | Reemplazar lista completa para usuario.      |
| `VALIDATE_INSTITUTE_BY_ID`   | modules-microservice  | Check existencia de instituto.               |
| `VALIDATE_USER_BY_ID`        | modules-microservice  | Check existencia de usuario.                 |

## incident

| cmd                            | Atendido por             | Propósito                                     |
| ------------------------------ | ------------------------ | --------------------------------------------- |
| `CREATE_INCIDENT`              | incident-microservice    | Crear incidente.                              |
| `UPDATE_INCIDENT`              | incident-microservice    | Actualizar incidente.                         |
| `UPDATE_INCIDENT_STATUS`       | incident-microservice    | Cambiar status.                               |
| `DELETE_INCIDENT`              | incident-microservice    | Borrar incidente.                             |
| `GET_INCIDENT`                 | incident-microservice    | Listar por instituto.                         |
| `GET_INCIDENT_BY_ID`           | incident-microservice    | Obtener por ID.                               |
| `GET_INCIDENT_PDF_BY_ID`       | incident-microservice    | Generar PDF del incidente.                    |
| `GET_INCIDENT_TYPE`            | incident-microservice    | Catálogo de tipos.                            |
| `GET_INCIDENT_SUB_TYPE`        | incident-microservice    | Catálogo de subtipos.                         |
| `GET_REPORTS_INCIDENT`         | incident-microservice    | Reporte agregado con filtros.                 |
| `SEND_INCIDENT_EMAIL`          | incident-microservice    | Enviar email del incidente (SMTP).            |
| `GENERATE_PRESIGNED_URL`       | incident-microservice    | Pre-signed URL S3 para subir archivo.         |
| `UPLOAD_INCIDENT_FILE`         | incident-microservice    | Guardar meta del archivo subido.              |
| `CONFIRM_UPLOAD`               | incident-microservice    | Confirmar upload completo.                    |

## people-management

| cmd                                 | Atendido por                      | Propósito                                 |
| ----------------------------------- | --------------------------------- | ----------------------------------------- |
| `CREATE_PEOPLE`                     | people-management-microservice    | Alta de persona.                          |
| `UPDATE_PEOPLE`                     | people-management-microservice    | Actualizar persona.                       |
| `DELETE_PEOPLE`                     | people-management-microservice    | Borrar persona.                           |
| `GET_PEOPLE`                        | people-management-microservice    | Listar.                                   |
| `GET_PEOPLE_BY_ID`                  | people-management-microservice    | Obtener por ID.                           |
| `GET_PEOPLE_SUMMARY`                | people-management-microservice    | Resumen (dropdowns).                      |
| `GET_PEOPLE_SECURITY`               | people-management-microservice    | Personas con rol de seguridad.            |
| `GET_PEOPLE_FORM_DATA`              | people-management-microservice    | Catálogos para el form (selects).         |
| `CREATE_CONTRACT`                   | people-management-microservice    | Alta de contrato.                         |
| `TERMINATE_CONTRACT`                | people-management-microservice    | Terminar contrato.                        |
| `REENTRY_CONTRACT`                  | people-management-microservice    | Re-ingreso.                               |
| `GET_CONTRACT_BY_ID`                | people-management-microservice    | Obtener contrato.                         |
| `GET_CONTRACTS_BY_PEOPLE`           | people-management-microservice    | Contratos de una persona.                 |
| `UPLOAD_CONTRACT_FILE`              | people-management-microservice    | Guardar meta del archivo.                 |
| `GENERATE_PRESIGNED_URL_CONTRACT`   | people-management-microservice    | Pre-signed URL S3.                        |
| `CONFIRM_UPLOAD_CONTRACT`           | people-management-microservice    | Confirmar upload.                         |
| `GET_PROVINCES_BY_DEPARTMENT`       | people-management-microservice    | Ubigeo: provincias.                       |
| `GET_DISTRICTS_BY_PROVINCE`         | people-management-microservice    | Ubigeo: distritos.                        |

## camera

| cmd            | Atendido por        | Propósito              |
| -------------- | ------------------- | ---------------------- |
| `GET_HEAT_MAP` | camera-microservice | Datos de heat map.     |

## dashboard

| cmd                        | Atendido por           | Propósito                       |
| -------------------------- | ---------------------- | ------------------------------- |
| `GET_DASHBOARD_KPIS`       | dashboard-microservice | KPIs del dashboard.             |
| `GET_DASHBOARD_INCIDENTS`  | dashboard-microservice | Incidentes agregados.           |
| `GET_DASHBOARD_TOP`        | dashboard-microservice | Top (rankings).                 |
| `GET_DASHBOARD_WORK`       | dashboard-microservice | Reporte de trabajo.             |

---

Para regenerar este listado:

```bash
for d in http-api-gateway/src/modules/*/; do
  echo "=== $(basename $d) ==="
  grep -rhoE "cmd: '[A-Za-z_]+'" $d 2>/dev/null | sort -u
done
```
