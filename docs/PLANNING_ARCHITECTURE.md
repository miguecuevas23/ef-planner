# EF Planner — Arquitectura de planificación

## ¿Por qué una base SQLite separada?

El módulo de actividades y el módulo de planificación tienen ciclos de vida y
esquemas de migración distintos. Mantenerlos en bases separadas permite:

- Evolucionar el esquema de planificación sin afectar la base de actividades.
- Hacer respaldos independientes sin mezclar tablas.
- Evitar dependencias rígidas entre ambos módulos.
- Que un fallo en la base de planificación no bloquee la biblioteca de
  actividades.

## Bases de datos

| Base | Archivo lógico | Responsabilidad |
|------|---------------|-----------------|
| Principal | `sqlite:ef_planner.db` | Actividades, favoritos, configuración general, metadatos, settings |
| Planificación | `sqlite:ef_planner_planning.db` | Planes de clase, bloques, actividades asignadas, configuración de planificación |

## `activity_id` sin foreign key entre bases

SQLite no soporta foreign keys entre archivos de base de datos distintos. La
columna `activity_id` en `lesson_plan_activities` es una referencia conceptual a
`activities.id` en `ef_planner.db`, pero no existe una restricción de integridad
automática.

## `activity_snapshot_json`

Cuando se asigna una actividad a una planificación, se guarda una copia
(snapshot) de los datos pedagógicos relevantes en formato JSON. Esto asegura que
la planificación conserve la información de la actividad incluso si la actividad
original es modificada o eliminada después.

## ¿Qué se habilita en 1.5.0?

- Base `ef_planner_planning.db` con tablas vacías.
- Esquema completo con índices y foreign keys internas.
- Tarjeta "Planificación" en el dashboard.
- Pantalla "Próximamente".
- Feature flag `FEATURES.planning = false`.

No hay CRUD de planificación en esta versión.

## ¿Qué queda pendiente para 2.0?

- Formulario de creación y edición de planes de clase.
- Asignación de actividades desde la biblioteca.
- Editor de bloques (momentos de clase).
- Snapshot automático al asignar actividades.
- UI completa de planificación con drag & drop.
- Cambiar `FEATURES.planning = true`.
- Respaldo independiente de planificaciones.

## Estrategia de respaldos

En 1.5.0, los respaldos JSON existentes solo contienen actividades. La base de
planificación NO se incluye en los respaldos actuales.

En 2.0 se implementará:

- Respaldo independiente de planificaciones (JSON o formato propio).
- Posiblemente un paquete compuesto (ZIP con ambas bases) sin romper el formato
  actual de respaldo de actividades.

## Reglas de migración

- Nunca `DROP TABLE` en ninguna de las dos bases.
- Migraciones incrementales con historial separado.
- `planning_migration_history` controla las migraciones de planificación.
- `migration_history` controla las migraciones de actividades.
- Las migraciones de planificación no tocan tablas de actividades.
