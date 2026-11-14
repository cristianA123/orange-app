# Referencia: mapa de servicios

| Servicio                          | Puerto host  | Responsabilidad                                                                 | Depende de       |
| --------------------------------- | ------------ | ------------------------------------------------------------------------------- | ---------------- |
| `http-api-gateway`                | `$PORT`:3000 | Entrypoint HTTP (`/api`). Auth guard global. Reenvía por NATS.                  | nats             |
| `users-microservice`              | —            | CRUD usuarios + auth (login, refresh, `VERIFY_TOKEN`).                          | nats, mysql_db   |
| `institute-microservice`          | —            | CRUD institutos (tenants).                                                      | nats, mysql_db   |
| `modules-microservice`            | —            | Permisos y módulos por instituto / usuario.                                     | nats, mysql_db   |
| `camera-microservice`             | —            | Cámaras y heat map.                                                             | nats, mysql_db   |
| `incident-microservice`           | —            | Incidentes, PDFs (pdfmake), emails SMTP, archivos S3.                           | nats, mysql_db, S3, SMTP |
| `people-management-microservice`  | —            | Personas, contratos, archivos de contrato S3, ubigeo.                           | nats, mysql_db, S3 |
| `dashboard-microservice`          | —            | KPIs y reportes agregados.                                                      | nats, mysql_db   |

### Infra compartida (dev)

| Container | Imagen  | Puerto host | Notas                                             |
| --------- | ------- | ----------- | ------------------------------------------------- |
| `nats`    | `nats`  | `4222`      | Broker único.                                     |
| `mysql_db`| `mysql` | `3306`      | `MYSQL_DATABASE=nestjs_db`, user `testuser`.      |

### Fuente de verdad del schema

Todo lo relativo a la base MySQL (entidades, migraciones) vive en `http-api-gateway/`. Los micros tienen **copias** de las entidades que necesitan. Ver [`conventions/entities.md`](../conventions/entities.md).
