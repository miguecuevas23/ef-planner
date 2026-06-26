# EF Planner

Biblioteca pedagógica offline para profesores de Educación Física. Aplicación de escritorio que permite crear, buscar, editar, eliminar y respaldar actividades pedagógicas sin conexión a internet. Incluye el módulo de Planificación con un Constructor de Habilidades y una Biblioteca de Conocimientos para construir Objetivos de Aprendizaje.

## Tecnologías

- [Tauri 2](https://tauri.app/) — framework de escritorio multiplataforma (macOS, Windows, Linux)
- [React 19](https://react.dev/) — interfaz de usuario
- [TypeScript](https://www.typescriptlang.org/) — tipado estático
- [SQLite](https://www.sqlite.org/) — base de datos local (dos bases separadas)
- [Vite](https://vite.dev/) — bundler
- [pnpm](https://pnpm.io/) — gestor de paquetes

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

# Build producción multiplataforma
pnpm tauri build
```

## Build beta para testers

El workflow de GitHub Actions genera builds para:

- macOS Apple Silicon (`.dmg` + updater `.app.tar.gz`)
- Windows x64 (`.exe` NSIS)
- Linux x64 (`.AppImage`)

```bash
# macOS Apple Silicon
pnpm tauri build --target aarch64-apple-darwin

# Windows x64
pnpm tauri build --target x86_64-pc-windows-msvc

# Linux x64
pnpm tauri build --target x86_64-unknown-linux-gnu
```

Los instalables se generan en `src-tauri/target/<target>/release/bundle/`.

## Actualizaciones multiplataforma

EF Planner usa Tauri Updater con dos canales permanentes:

- **macOS:** `https://github.com/miguecuevas23/ef-planner/releases/download/updater-macos-beta/latest.json`
- **Windows / Linux:** `https://github.com/miguecuevas23/ef-planner/releases/download/updater-windows-linux-beta/latest.json`

Los workflows `.github/workflows/release-macos.yml` y `.github/workflows/release-windows-linux.yml` generan los artefactos y actualizan el canal correspondiente automáticamente al hacer push de un tag.

Tags soportados:

- `v*-beta-macos` (ej. `v1.7.0-beta-macos`)
- `v*-beta-windows-linux` (ej. `v1.7.0-beta-windows-linux`)

## Bases de datos

| Base | Archivo lógico | Responsabilidad |
|------|---------------|-----------------|
| Principal | `sqlite:ef_planner.db` | Actividades, favoritos, configuración general, metadatos, settings |
| Planificación | `sqlite:ef_planner_planning.db` | Habilidades, conocimientos, categorías y futura planificación de clases |

Ambas bases tienen migraciones independientes y FKs internas. No existen foreign keys entre archivos SQLite distintos.

## Módulos principales (v1.7.0-beta)

### Actividades
- CRUD completo de actividades pedagógicas
- Búsqueda por texto, filtro por momento de clase y capacidad física
- Importación desde JSON y TXT estructurados con vista previa editable
- Favoritas con sección exclusiva
- Respaldos JSON (exportar/importar)

### Planificación

El módulo de Planificación agrupa los componentes necesarios para construir Objetivos de Aprendizaje:

| Componente | Estado |
|-----------|--------|
| **Conocimientos** | Disponible — biblioteca con 12 áreas curriculares |
| **Habilidades** | Disponible — constructor con taxonomía de Bloom y 5 categorías EF |
| **Actitudes** | Próximamente |
| **Objetivos de Aprendizaje** | Próximamente |
| **Planificaciones** | Próximamente |

#### Conocimientos
- Biblioteca con filtros por nivel educativo, curso y área
- 12 áreas predefinidas: Motricidad, Juegos y Deportes, Condición Física, Salud y Vida Activa, Expresión Corporal, Danza, Estrategias y Tácticas, Entrenamiento, Autocuidado y Seguridad, Primeros Auxilios, Liderazgo y Participación, Vida Activa y Comunidad
- Posibilidad de crear nuevas áreas manualmente
- CRUD completo, duplicación, favoritos
- UUID v4 en todos los registros para sincronización futura

#### Habilidades (Constructor)
- Wizard de construcción basado en la taxonomía de Bloom (6 niveles)
- Cinco categorías pedagógicas:
  - Patrones Motores
  - Habilidades motrices básicas
  - Habilidades motrices específicas
  - Habilidades motrices especializadas
  - Capacidades físicas (Fuerza, Velocidad, Resistencia, Coordinación, Equilibrio)
- Generación automática: `Verbo + patrón, habilidad o capacidad + contexto`
- Edición manual del texto final
- Biblioteca con filtros por nivel, proceso, categoría, capacidad y estado

### Otras funcionalidades
- **Persistencia**: migraciones incrementales, nunca `DROP TABLE`
- **Respaldos JSON**: exportar/importar todas las actividades
- **Configuración**: versión, canal, actualizaciones, carpeta de respaldos
- **Navegación**: botones Home y Volver, diseño responsive con scroll
- **Offline**: completamente offline, sin backend ni login

## Estructura del proyecto

```
ef-planner/
├── src/
│   ├── modules/
│   │   ├── activities/        # CRUD de actividades
│   │   ├── backup/            # Respaldos JSON
│   │   ├── dashboard/         # Página principal
│   │   ├── favorites/         # Actividades favoritas
│   │   ├── import/            # Importador JSON/TXT
│   │   ├── knowledge/         # Biblioteca de conocimientos
│   │   │   ├── types/         # TypeScript types
│   │   │   ├── services/      # Repositorio (usa planning DB)
│   │   │   └── pages/         # Biblioteca y formulario
│   │   ├── planning/          # Módulo de Planificación
│   │   │   ├── data/          # Taxonomía de Bloom
│   │   │   ├── constants/     # Categorías EF y capacidades físicas
│   │   │   ├── types/         # TypeScript types de habilidades
│   │   │   ├── services/      # Repositorios y servicios
│   │   │   └── pages/         # Menú, constructor, biblioteca, detalle
│   │   └── settings/          # Configuración
│   ├── database/              # db.ts, planningDb.ts y migraciones
│   ├── shared/                # Logo, constantes, feature flags, componentes
│   ├── styles/                # Estilos globales
│   └── App.tsx                # Router principal
├── src-tauri/                 # Backend Rust + configuración Tauri
│   ├── tauri.conf.json
│   ├── tauri.macos.conf.json
│   ├── tauri.macos.release.conf.json
│   ├── tauri.windows.conf.json
│   └── tauri.linux.conf.json
├── docs/
│   ├── PLANNING_ARCHITECTURE.md
│   └── SKILL_OBJECTIVE_ARCHITECTURE.md
└── .github/workflows/
    ├── release-macos.yml
    └── release-windows-linux.yml
```

## Documentación adicional

- [`docs/PLANNING_ARCHITECTURE.md`](docs/PLANNING_ARCHITECTURE.md) — arquitectura de la base de planificación
- [`docs/SKILL_OBJECTIVE_ARCHITECTURE.md`](docs/SKILL_OBJECTIVE_ARCHITECTURE.md) — arquitectura del Constructor de Habilidades

## Estrategia de actualizaciones seguras

EF Planner es **local-first**. Los datos residen en SQLite local y nunca se borran durante actualizaciones. Las migraciones de BD son incrementales — nunca `DROP TABLE`. Las actualizaciones solo reemplazan el binario de la app, no tocan las bases de datos.

## Roadmap

- **1.8.0**: Actitudes como componente del OA
- **2.0.0**: Objetivos de Aprendizaje completos (Habilidad + Conocimiento + Actitud)
- **2.x**: Planificación de clases, unidades didácticas, evaluaciones
- **Futuro**: exportación a PDF, sincronización opcional entre dispositivos
