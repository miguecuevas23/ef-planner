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

## Funcionalidades (v0.1.0)

- Dashboard inicial
- Biblioteca de actividades con CRUD completo
- Búsqueda por texto, filtro por momento de clase y capacidad física
- Vista de detalle con toda la información pedagógica
- Marcar/desmarcar actividades como favoritas
- Sección de favoritas
- Persistencia local en SQLite
- Exportar respaldo a archivo JSON
- Importar respaldo desde archivo JSON
- App completamente offline

## Funcionalidades futuras

- Planificación de clases
- Unidades didácticas
- Evaluaciones
- Exportación a PDF
