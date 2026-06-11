# Estrategia de actualizaciones seguras

## Principio fundamental

EF Planner es **local-first**. Los datos del profesor residen en SQLite local y son **intocables** durante cualquier actualización de la aplicación.

## Diferencia clave

- **Actualizar la app**: nueva versión del binario (código, UI, features). No toca la BD.
- **Migrar la BD**: cambios estructurales en tablas (nuevas columnas, índices). Incremental, sin borrar datos.

## Estructura de protección

### 1. SQLite local protegido

La BD `ef_planner.db` se almacena en el directorio de datos de la app. Las actualizaciones de Tauri no sobrescriben este directorio.

### 2. Migraciones incrementales

`src/database/migrations.ts` ejecuta migraciones una sola vez mediante la tabla `migration_history`. Reglas:

- Solo `CREATE TABLE IF NOT EXISTS` y `ALTER TABLE`
- **Nunca `DROP TABLE`**
- **Nunca `DELETE` sin WHERE específico**
- Cada migración se registra con timestamp

### 3. Separación app / datos

```
App binaria (Tauri)     → se reemplaza al actualizar
SQLite database          → NUNCA se toca
app_metadata             → versión de esquema, flags
app_settings             → preferencias del usuario
```

## Flujo de actualización con Tauri Updater

```
1. App detecta nueva versión
2. Usuario acepta actualizar
3. Tauri Updater descarga e instala nuevo binario
4. Al iniciar, runDatabaseMigrations() revisa migraciones pendientes
5. Si schema_version < actual, ejecuta migraciones incrementales
6. App lista con datos intactos
```

Las actualizaciones son **siempre opcionales**. El usuario decide cuándo buscar y cuándo instalar. Nunca se fuerza una actualización automática.

Las actualizaciones **solo reemplazan el binario** de la app. No tocan SQLite, no sincronizan datos, no borran actividades ni favoritas.

## Para testers (versión beta)

1. **Siempre hacer respaldo JSON** antes de probar una nueva versión (Dashboard → Respaldos → Exportar)
2. Si algo falla, restaurar desde el JSON
3. Reportar cualquier pérdida de datos como bug crítico

## Lo que NUNCA debe pasar

| Prohibido | Motivo |
|---|---|
| `DROP TABLE activities` | Borra todas las actividades del profesor |
| `DELETE FROM activities` | Igual |
| Sobrescribir la BD con una vacía | Pérdida total |
| Migraciones sin `IF NOT EXISTS` | Errores si ya existe |
| `localStorage.clear()` | Borra preferencias |
