import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { APP_VERSION } from "../../../shared/constants/appVersion";
import { UpdateCheckResult } from "../types/update";

function isUpdaterConfigured(): boolean {
  return true;
}

let pendingUpdate: Update | null = null;

export function getPendingUpdate(): Update | null {
  return pendingUpdate;
}

export async function checkForUpdates(): Promise<UpdateCheckResult> {
  if (!isUpdaterConfigured()) {
    return {
      status: "not_configured",
      currentVersion: APP_VERSION,
      message: "Actualizaciones preparadas, pero falta configurar claves y GitHub Releases.",
    };
  }

  try {
    const update = await check();
    if (!update) {
      pendingUpdate = null;
      return {
        status: "not_available",
        currentVersion: APP_VERSION,
        message: "Ya tienes la versión más reciente.",
      };
    }

    pendingUpdate = update;
    return {
      status: "available",
      currentVersion: APP_VERSION,
      latestVersion: update.version,
      message: `Hay una nueva versión disponible: ${update.version}`,
      notes: update.body || "",
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

export interface DownloadProgress {
  downloaded: number;
  total: number | null;
}

export async function downloadAndInstallUpdate(
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  const update = pendingUpdate;
  if (!update) throw new Error("No hay actualización pendiente.");

  try {
    await update.downloadAndInstall((event) => {
      if (event.event === "Progress" && onProgress) {
        onProgress({
          downloaded: event.data.chunkLength || 0,
          total: null,
        });
      }
    });

    pendingUpdate = null;
    await relaunch();
  } catch (error) {
    console.error("[Updater] Install failed:", error);
    throw error;
  }
}
