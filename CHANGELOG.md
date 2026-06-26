# Changelog

## 1.7.0-beta

- Agregado módulo "Conocimientos" con base SQLite independiente.
- Agregada Biblioteca de Conocimientos con filtros por nivel, curso y área.
- Agregado formulario de creación y edición de conocimientos.
- Agregadas 12 áreas curriculares predefinidas con posibilidad de crear nuevas.
- Agregado CRUD completo, duplicación, favoritos y eliminación.
- Agregada preparación con UUID para futuras versiones.
- Mantenida separación total con bases de actividades, planificación y habilidades.
- Mantenidos canales de actualización separados por plataforma.

## 1.6.0-beta

- Agregado constructor experimental de componentes de habilidad.
- Integrada taxonomía de Bloom desde catálogo JSON.
- Agregada selección de nivel educativo y cursos.
- Agregada selección de proceso cognitivo y verbo.
- Agregadas categorías de habilidades de Educación Física.
- Agregados campos de habilidad, contexto y criterio.
- Agregada vista previa editable.
- Agregada biblioteca de habilidades por curso.
- Agregado CRUD, favoritos y duplicación de habilidades.
- Agregado feature flag experimental.
- Mantenido acceso público de Planificación como "Próximamente".
- Preparada arquitectura futura para conocimientos, actitudes y OA completos.

## 1.5.0-beta

- Preparada la arquitectura inicial del futuro planificador de clases.
- Agregada base SQLite independiente ef_planner_planning.db.
- Agregadas tablas iniciales para planificaciones, bloques y actividades.
- Agregado control de esquema independiente para planificación.
- Agregada tarjeta "Planificación" en el dashboard.
- Agregada pantalla informativa "Próximamente".
- Preparado feature flag para habilitar el módulo en EF Planner 2.0.
- Mantenida intacta la biblioteca actual de actividades.
- Mantenidos canales de actualización separados por plataforma.

## 1.4.0-beta

- Preparada distribución inicial para Windows x64 mediante NSIS.
- Preparada distribución inicial para Linux x64 mediante AppImage.
- Mantenida distribución para macOS Apple Silicon.
- Preparado workflow multiplataforma en GitHub Actions.
- Preparado latest.json multiplataforma para canal updater-beta.
- Mantenido endpoint permanente updater-beta.

## 1.3.1-beta

- Mejorada adaptación visual de la app en ventanas pequeñas.
- Agregado scroll vertical en páginas con contenido largo.
- Mejorado comportamiento responsive de grillas, formularios y tablas.
- Agregada edición de actividades importadas antes de guardarlas.
- Agregada revalidación después de modificar actividades en la vista previa.
- Mejorada corrección de advertencias y errores durante la importación.
- Mantenido endpoint permanente updater-beta.

## 1.3.0-beta

- Agregado módulo "Importar actividades".
- Agregada importación desde JSON estructurado.
- Agregada importación desde TXT estructurado.
- Agregada vista previa antes de guardar actividades importadas.
- Agregada validación de campos obligatorios.
- Agregada detección simple de posibles duplicados.
- Agregada opción para importar solo actividades seleccionadas.
- Se mantiene PDF e IA fuera de esta versión.
- Mantenido endpoint permanente updater-beta.

## 1.2.5-beta

- Agregado soporte para logo interno de EF Planner.
- Preparada integración de ícono real de la app mediante Tauri icon.
- Ajustada paleta visual para una identidad más profesional y educativa.
- Mejorado contraste visual en botones, tarjetas y mensajes.
- Mantenido endpoint permanente updater-beta.

## 1.2.4-beta

- Establecido valor por defecto de 2 estudiantes mínimos al crear una nueva actividad.

## 1.2.3-beta

- Agregado botón "Actualizar ahora" cuando existe una nueva versión disponible.
- Agregado flujo de descarga, instalación y reinicio de la app.
- Agregado estado visual de progreso durante la actualización.
- Mantenido endpoint permanente updater-beta.

## 1.2.2-beta

- Agregado aviso inicial de ubicación de datos y respaldos.
- Agregada selección de carpeta predeterminada para respaldos JSON.
- Agregada sección "Datos y respaldos" en Configuración.
- Agregado respaldo rápido a carpeta configurada.
- Mantenido endpoint permanente updater-beta para actualizaciones futuras.

## 1.2.1-beta

- Agregado botón Inicio/Home en las páginas internas para volver rápidamente al menú principal.
- Configurado canal permanente beta del updater mediante release updater-beta.
- Evitado uso de endpoints fijos por versión para futuras actualizaciones.
- Preparada app 1.2.1-beta para detectar futuras versiones beta como 1.2.2-beta.

## 1.2.0-beta

- Agregado mensaje de confirmación al modificar actividades.
- Agregado botón Volver arriba y abajo en pantallas largas.
- Mejorada selección de cursos mediante casillas y opción seleccionar todos.
- Corregido contraste visual del mensaje de actualización.
- Preparada versión beta 1.2.0 para distribución por GitHub Releases.

## 1.1.0-beta — Versión para testers

- Base SQLite protegida con migraciones incrementales.
- Configuración local de versión y canal (beta/stable).
- CRUD completo de actividades.
- Favoritas.
- Respaldos JSON.
- Preparación inicial para futuras actualizaciones seguras.
- Modo fallback: si SQLite no conecta, muestra actividades de ejemplo.

## 0.1.0 — Versión interna

- Dashboard inicial con navegación a módulos.
- Biblioteca de actividades con CRUD completo (crear, buscar, editar, eliminar).
- Filtros por texto, momento de clase y capacidad física.
- Vista de detalle con información pedagógica completa.
- Favoritas: marcar/desmarcar y ver lista de favoritas.
- SQLite local con seed inicial de actividades de ejemplo.
- Exportar respaldo a archivo JSON.
- Importar respaldo desde archivo JSON sin duplicar.
- Modal de confirmación para eliminación.
- App completamente offline.
- Mensajes de carga, éxito y error en toda la app.
