# EF Planner

Biblioteca pedagógica offline para profesores de Educación Física. Aplicación de escritorio que permite crear, buscar, editar, eliminar y respaldar actividades pedagógicas sin conexión a internet.

## Tecnologías

- [Tauri 2](https://tauri.app/) — framework de escritorio
- [React 19](https://react.dev/) — interfaz de usuario
- [TypeScript](https://www.typescriptlang.org/) — tipado estático
- [SQLite](https://www.sqlite.org/) — base de datos local
- [Vite](https://vite.dev/) — bundler

## Requisitos

- Node.js 18+
- pnpm
- Rust (para compilar Tauri)

## Comandos

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm tauri dev

# Build producción
pnpm tauri build
```

## Funcionalidades (v1.1)

- Dashboard con navegación a todos los módulos
- Biblioteca de actividades con CRUD completo
- Búsqueda por texto, filtro por momento de clase y capacidad física
- Vista de detalle con información pedagógica completa
- Marcar/desmarcar actividades como favoritas
- Sección de favoritas
- Persistencia local en SQLite
- Exportar respaldo a archivo JSON
- Importar respaldo desde archivo JSON sin duplicar
- App completamente offline
- Configuración de actualizaciones y canal (beta/stable)
- Sistema de migraciones incrementales (protege datos del usuario)

## Estrategia de actualizaciones seguras

EF Planner es **local-first**. Los datos residen en SQLite local y nunca se borran durante actualizaciones. Las migraciones de BD son incrementales (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE`) — nunca `DROP TABLE`. Ver [`docs/UPDATE_STRATEGY.md`](docs/UPDATE_STRATEGY.md) para más detalles.

## Funcionalidades futuras

- Planificación de clases
- Unidades didácticas
- Evaluaciones
- Exportación a PDF
- Actualizaciones automáticas con Tauri Updater
- Sincronización opcional entre dispositivos
