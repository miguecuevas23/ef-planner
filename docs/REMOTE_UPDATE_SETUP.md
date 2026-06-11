# Configuración de actualizaciones remotas

## Estado actual

La app ya tiene el plugin updater de Tauri instalado y la UI lista. Falta configurar el servidor de actualizaciones para que el botón "Buscar actualizaciones" funcione realmente.

## ¿Qué se necesita?

### 1. Generar claves del updater

```bash
pnpm tauri signer generate -w ~/.ef-planner-updater
```

Esto genera dos archivos:
- `~/.ef-planner-updater.key` → **private key** (NUNCA subir a Git)
- `~/.ef-planner-updater.pub` → **public key** (va en tauri.conf.json)

### 2. Configurar tauri.conf.json

Abrí `src-tauri/tauri.conf.json` y reemplazá los placeholders:

```json
"plugins": {
  "updater": {
    "endpoints": [
      "https://TU_SERVIDOR.com/latest.json"
    ],
    "pubkey": "CONTENIDO_DE_ef-planner-updater.pub"
  }
}
```

La **pubkey** es el contenido completo del archivo `.pub` (incluye `dW50cnVzdGVk...`).

La **private key** se usa solo al hacer `pnpm tauri build` para firmar la build. Nunca va en el repositorio.

### 3. Crear latest.json

Este archivo va en tu servidor y Tauri Updater lo consulta. Formato:

```json
{
  "version": "1.2.0",
  "notes": "Nueva funcionalidad: planificación de clases.",
  "pub_date": "2025-07-01T12:00:00Z",
  "platforms": {
    "darwin-aarch64": {
      "signature": "CONTENIDO_DE_ef-planner.app.tar.gz.sig",
      "url": "https://TU_SERVIDOR.com/EF Planner_aarch64.app.tar.gz"
    },
    "darwin-x86_64": {
      "signature": "CONTENIDO_DE_ef-planner.app.tar.gz.sig",
      "url": "https://TU_SERVIDOR.com/EF Planner_x86_64.app.tar.gz"
    }
  }
}
```

### 4. Archivos generados por pnpm tauri build

Cuando ejecutás `pnpm tauri build` con `createUpdaterArtifacts: true`, se generan:

```
src-tauri/target/release/bundle/macos/EF Planner.app.tar.gz
src-tauri/target/release/bundle/macos/EF Planner.app.tar.gz.sig
```

- El `.tar.gz` es la app comprimida → se sube al servidor
- El `.sig` contiene la firma → su contenido va en `latest.json`

### 5. Flujo completo

```
1. Build v1.1.0 con updater configurado
2. Instalar en Mac de prueba
3. Desarrollar v1.2.0
4. Build v1.2.0 con la private key
5. Subir .tar.gz y .sig al servidor
6. Actualizar latest.json con la nueva versión
7. Abrir v1.1.0 instalada
8. Configuración → Buscar actualizaciones
9. Descargar e instalar v1.2.0
10. Los datos SQLite se conservan intactos
```

## Seguridad

- La private key NUNCA se comparte ni se sube a Git
- Agregá `*.key` a `.gitignore`
- El `.sig` verifica que la actualización es auténtica
- Si alguien modifica el `.tar.gz`, la firma no coincide y la actualización se rechaza
