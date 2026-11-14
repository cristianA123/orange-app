# Documentación — Orange microservices

Documentación operativa del monorepo. Pensada para que humanos y agentes (Claude Code) entiendan el patrón **real** del proyecto y hagan cambios sin romper convenciones.

El `CLAUDE.md` de la raíz es solo un índice: todo el detalle vive aquí.

## Cómo usar esta documentación

- **¿Vas a hacer un cambio?** Ve directo al [playbook](#playbooks) correspondiente.
- **¿Dudas de "cómo se hace acá"?** Revisa [convenciones](#convenciones).
- **¿Necesitas un dato puntual?** (`cmd` existente, variable de entorno, puerto) → [referencia](#referencia).
- **¿Problemas corriendo o deployando?** → [ops](#operaciones).

## Arquitectura

- [architecture.md](./architecture.md) — overview del sistema: gateway HTTP, microservicios NATS, flujo de un request de principio a fin.

## Playbooks

Guías paso a paso. **Si tu tarea aparece acá, sigue el playbook**: captura el estándar real del código.

- [add-endpoint.md](./playbooks/add-endpoint.md) — agregar un endpoint REST nuevo (los dos lados: gateway + microservicio).
- [add-entity-and-migration.md](./playbooks/add-entity-and-migration.md) — crear una entidad TypeORM nueva y la migración.
- [add-module-in-gateway.md](./playbooks/add-module-in-gateway.md) — registrar un módulo HTTP nuevo en el gateway.
- [add-microservice.md](./playbooks/add-microservice.md) — crear un microservicio de negocio desde cero.
- [run-migrations.md](./playbooks/run-migrations.md) — cuándo y cómo correr migraciones.

## Convenciones

El estándar que ya se aplica en el código y debe mantenerse en cambios futuros.

- [naming.md](./conventions/naming.md) — nombres de `cmd` NATS, archivos, clases, DTOs.
- [dto-validation.md](./conventions/dto-validation.md) — `class-validator` + ValidationPipe global.
- [response-format.md](./conventions/response-format.md) — `successResponse` / `errorResponse` y filter HTTP.
- [error-handling.md](./conventions/error-handling.md) — `RpcException` en micros, `handleRpcError` en gateway.
- [auth.md](./conventions/auth.md) — guard global, `@Public`, `@UserDecorator`, JWT, multi-tenancy por `instituteId`.
- [entities.md](./conventions/entities.md) — por qué las entidades están duplicadas y cómo mantenerlas sincronizadas.

## Referencia

Datos planos para consulta.

- [nats-commands.md](./reference/nats-commands.md) — catálogo de todos los `cmd` NATS, agrupados por dominio.
- [env-vars.md](./reference/env-vars.md) — qué variable usa cada microservicio.
- [services-map.md](./reference/services-map.md) — qué hace cada microservicio, en una línea.

## Operaciones

- [local-dev.md](./ops/local-dev.md) — levantar todo localmente con Docker Compose.
- [deploy.md](./ops/deploy.md) — build de producción con `docker-compose.prod.yml`.
- [troubleshooting.md](./ops/troubleshooting.md) — errores típicos y cómo resolverlos.
