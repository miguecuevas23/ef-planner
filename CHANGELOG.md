# Changelog

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
