# Orange team

## Migraciones

* Crear migraciones
```
npm run migration:generate ./src/migrations/InitSchema
```

* Ejecutar MIgraciones
```
npm run migration:run
```

* Levantar servicios
```
docker compose -f docker-compose.prod.yml up --build -d
```