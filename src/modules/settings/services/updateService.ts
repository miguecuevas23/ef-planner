import { check } from "@tauri-apps/plugin-updater";
import { APP_VERSION } from "../../../shared/constants/appVersion";
import { UpdateCheckResult } from "../types/update";

export async function checkForUpdates(): Promise<UpdateCheckResult> {
  const hasEndpoint = false; // Cambiar a true cuando se configure el servidor

  if (!hasEndpoint) {
    return {
      status: "not_configured",
      currentVersion: APP_VERSION,
      message:
        "El sistema de actualizaciones está preparado, pero aún no hay servidor de actualizaciones configurado.",
    };
  }

  try {
    const update = await check();
    if (!update) {
      return {
        status: "not_available",
        currentVersion: APP_VERSION,
        message: "Ya tienes la versión más reciente.",
      };
    }

    return {
      status: "available",
      currentVersion: APP_VERSION,
      latestVersion: update.version,
      message: `Hay una nueva versión disponible: ${update.version}`,
    };
  } catch (error) {
    console.error("[Updater] Check failed:", error);
    return {
      status: "error",
      currentVersion: APP_VERSION,
      message: "No se pudo verificar actualizaciones. Revisa la consola.",
    };
  }
}

export async function installAvailableUpdate(): Promise<void> {
  try {
    const update = await check();
    if (update) {
      await update.downloadAndInstall();
    }
  } catch (error) {
    console.error("[Updater] Install failed:", error);
    throw error;
  }
}
