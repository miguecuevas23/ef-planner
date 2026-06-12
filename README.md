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

## Build beta para testers

Para generar la app instalable:

```bash
pnpm tauri build
```

El `.dmg` se genera en `src-tauri/target/release/bundle/dmg/`. La app también queda en `src-tauri/target/release/bundle/macos/EF Planner.app`.

- `pnpm tauri dev` es para desarrollo con hot-reload
- `pnpm tauri build` genera la app instalable para distribuir
- Los datos locales del usuario se conservan entre actualizaciones
- Se recomienda exportar respaldo JSON antes de probar versiones beta

## Ícono de la app

Para regenerar los íconos de la app a partir de una imagen fuente, coloca tu archivo `app-icon.png` en la raíz del proyecto y ejecuta:

```bash
pnpm tauri icon app-icon.png
```

Esto regenerará todos los tamaños de íconos en `src-tauri/icons/`.

## Funcionalidades (v1.2.5-beta)

### Biblioteca de actividades
- CRUD completo de actividades pedagógicas
- Búsqueda por texto, filtro por momento de clase y capacidad física
- Vista de detalle con información pedagógica completa
- Formulario con checkboxes para cursos sugeridos y opción "seleccionar todos"
- Modal de confirmación para eliminación

### Favoritas
- Marcar/desmarcar actividades como favoritas
- Sección exclusiva con filtro de favoritas

### Persistencia y migraciones
- Base de datos SQLite local protegida
- Sistema de migraciones incrementales (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE`)
- Nunca `DROP TABLE` — los datos del usuario son intocables
- Seed inicial de actividades de ejemplo

### Respaldos JSON
- Exportar todas las actividades a archivo JSON
- Importar desde archivo JSON sin duplicar
- Carpeta configurable para respaldo rápido

### Actualizaciones
- Tauri Updater integrado con GitHub Releases
- Canal beta permanente (`updater-beta`)
- Botón "Buscar actualizaciones" en Configuración
- Flujo completo: detectar → descargar → instalar → reiniciar
- Actualizaciones siempre opcionales, nunca automáticas

### Configuración
- Versión y canal de la app
- Estado del esquema de datos
- Preferencias de actualización (buscar al iniciar, canal beta/stable)
- Carpeta de respaldos configurable

### Onboarding
- Aviso inicial de ubicación de datos al abrir la app por primera vez
- Selección de carpeta predeterminada para respaldos

### Navegación
- Botón Home en todas las páginas internas
- Botón Volver al inicio y al final de páginas largas

### Offline
- App completamente offline, sin backend ni login

## Estrategia de actualizaciones seguras

EF Planner es **local-first**. Los datos residen en SQLite local y nunca se borran durante actualizaciones. Las migraciones de BD son incrementales — nunca `DROP TABLE`. Las actualizaciones solo reemplazan el binario de la app, no tocan la base de datos. Ver [`docs/UPDATE_STRATEGY.md`](docs/UPDATE_STRATEGY.md) para más detalles.

## Funcionalidades futuras

- Planificación de clases
- Unidades didácticas
- Evaluaciones
- Exportación a PDF
- Sincronización opcional entre dispositivos
