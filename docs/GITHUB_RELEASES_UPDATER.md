# Actualizaciones con GitHub Releases

## Configuración actual

El endpoint del updater apunta a:

```
https://github.com/TU_USUARIO_GITHUB/ef-planner/releases/latest/download/latest.json
```

La pubkey y el endpoint se configuran en `src-tauri/tauri.conf.json`.

## Cómo funciona

1. **Cada release de GitHub** incluye como asset un archivo `latest.json`
2. La app instalada (con updater integrado) consulta ese endpoint
3. Si hay una versión más nueva, la descarga e instala
4. Los datos SQLite locales **no se reemplazan** durante la actualización

## Pasos para habilitar

### 1. Generar claves del updater

```bash
pnpm tauri signer generate -w ~/.ef-planner-updater
```

- `~/.ef-planner-updater.key` → **private key** (no subir a Git)
- `~/.ef-planner-updater.pub` → **public key** (va en `tauri.conf.json`)

### 2. Configurar tauri.conf.json

Reemplazar placeholders:

```json
"plugins": {
  "updater": {
    "endpoints": [
      "https://github.com/TU_USUARIO_GITHUB/ef-planner/releases/latest/download/latest.json"
    ],
    "pubkey": "dW50cnVzdGVk...(contenido del .pub)"
  }
}
```

### 3. Configurar secrets en GitHub

En Settings → Secrets and variables → Actions → New repository secret:

| Secret | Valor |
|---|---|
| `TAURI_SIGNING_PRIVATE_KEY` | Contenido de `~/.ef-planner-updater.key` |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Contraseña de la private key (si usaste una) |

### 4. Activar el servicio

En `src/modules/settings/services/updateService.ts`, cambiar:

```typescript
function isUpdaterConfigured(): boolean {
  return true;
}
```

### 5. CI/CD con GitHub Actions

El workflow `.github/workflows/release.yml` se ejecuta al pushear un tag `v*` o manualmente desde la pestaña Actions.

El workflow:
- Compila en `macos-latest`
- Usa `pnpm` para instalar dependencias
- Ejecuta `tauri-apps/tauri-action@v0` con firma del updater
- Genera `.app`, `.dmg`, `.tar.gz`, `.sig` y `latest.json`
- Crea un GitHub Release con todos los assets

## Cómo crear un release

### 1. Subir la versión

En `src-tauri/tauri.conf.json` y `package.json`, cambiar `version` a la nueva (ej. `1.2.0`).

### 2. Commit y tag

```bash
git add .
git commit -m "Release v1.2.0"
git tag v1.2.0
git push origin main --tags
```

### 3. Verificar el workflow

Ir a Actions → Release → esperar que termine.

### 4. Verificar assets del release

El release en GitHub debe tener:
- `EF Planner_1.2.0_aarch64.dmg`
- `EF Planner_aarch64.app.tar.gz`
- `EF Planner_aarch64.app.tar.gz.sig`
- `latest.json`

### 5. Probar actualización desde app instalada

1. Instalar versión base (ej. 1.1.0) desde un `.dmg` anterior
2. Abrir EF Planner → Configuración → **Buscar actualizaciones**
3. Debe detectar 1.2.0, descargar e instalar
4. Al reabrir, los datos SQLite siguen intactos

## Seguridad

- La versión nueva debe ser **mayor** a la actual (comparación semántica)
- El `.sig` verifica que el archivo no fue alterado
- Si la firma no coincide, la actualización se rechaza
- Los datos SQLite del profesor nunca se tocan durante la actualización
- `TAURI_SIGNING_PRIVATE_KEY` es un secret de GitHub, nunca en el código
