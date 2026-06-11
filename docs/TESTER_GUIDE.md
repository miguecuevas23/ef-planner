# Guía para testers — EF Planner 1.1.0-beta

## ¿Qué es EF Planner?

EF Planner es una aplicación de escritorio offline para profesores de Educación Física. Permite crear, buscar, editar y respaldar actividades pedagógicas. No necesita internet.

## ¿Qué significa versión beta?

Es una versión de prueba. Puede tener errores. Tu feedback ayuda a mejorarla. **Siempre exportá un respaldo JSON antes de probar cosas nuevas.**

## Cómo instalar en Mac

1. Abrí el archivo `EF Planner_1.1.0_aarch64.dmg`
2. Arrastrá `EF Planner.app` a la carpeta Aplicaciones
3. Abrí `EF Planner.app`

## Si macOS advierte que no reconoce el desarrollador

1. Andá a **Preferencias del Sistema → Privacidad y Seguridad**
2. Buscá el mensaje sobre EF Planner
3. Hacé clic en **Abrir de todos modos**

Alternativa rápida: clic derecho en `EF Planner.app` → **Abrir** → confirmar.

## Antes de empezar: exportar respaldo

1. Abrí EF Planner
2. Dashboard → **Respaldos**
3. **Exportar actividades** → elegí dónde guardar el archivo `.json`
4. Este archivo es tu copia de seguridad. Guardalo en un lugar seguro.

## Qué probar

### Crear actividad
- Dashboard → **Nueva actividad**
- Llená el formulario (campos con * son obligatorios)
- **Guardar actividad**
- La actividad debe aparecer en **Buscar actividades**

### Editar actividad
- **Buscar actividades** → clic en una tarjeta → **Ver detalle**
- **Editar actividad** → modificá campos → **Guardar cambios**
- La actividad debe actualizarse

### Eliminar actividad
- **Buscar actividades** → Ver detalle → **Eliminar actividad**
- Confirmar en el modal → la actividad desaparece de la lista

### Marcar favorita
- Ver detalle → **Marcar como favorita** / **Quitar de favoritas**
- Dashboard → **Favoritas** → ve solo las marcadas

### Respaldos
- **Respaldos** → **Exportar actividades** → guarda un `.json`
- **Respaldos** → **Importar respaldo** → selecciona un `.json`
- Las actividades importadas aparecen en Buscar sin duplicar

### Persistencia
- Creá actividades, cerrá la app, volvé a abrir
- Las actividades deben seguir ahí

## Cómo reportar errores

Enviame por mensaje:
- Qué estabas haciendo
- Qué esperabas que pasara
- Qué pasó en realidad
- Si aparece algún mensaje de error en pantalla
- Si podés, una captura de pantalla

Si sabés abrir la consola de desarrollador (Ctrl+Shift+I o Cmd+Option+I), los mensajes en rojo ayudan mucho a diagnosticar.
