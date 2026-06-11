import { useState, useEffect } from "react";
import { exportActivitiesBackup, importActivitiesBackup } from "../services/backupService";
import { ImportResult } from "../types/backup";
import { getSetting } from "../../../database/metadataRepository";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { getAllActivities } from "../../activities/services/activityRepository";
import HomeButton from "../../../shared/components/HomeButton";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./BackupPage.css";

interface PageProps {
  onBack: () => void;
}

function BackupPage({ onBack }: PageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [backupDir, setBackupDir] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const dir = await getSetting("backup_directory");
      setBackupDir(dir);
    }
    load();
  }, []);

  function showSuccess(text: string) {
    setMessage(text);
    setMessageType("success");
  }

  function showError(text: string) {
    setMessage(text);
    setMessageType("error");
  }

  function showInfo(text: string) {
    setMessage(text);
    setMessageType("info");
  }

  async function handleExport() {
    setIsLoading(true);
    setMessage("");
    try {
      await exportActivitiesBackup();
      showSuccess("Respaldo exportado correctamente.");
    } catch (error) {
      console.error("[Backup] Export error:", error);
      showError("No se pudo exportar el respaldo. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuickExport() {
    if (!backupDir) return;
    setIsLoading(true);
    setMessage("");
    try {
      const activities = await getAllActivities();
      const backup = {
        app: "EF Planner",
        version: "1.0",
        exportedAt: new Date().toISOString(),
        totalActivities: activities.length,
        activities,
      };
      const json = JSON.stringify(backup, null, 2);
      const today = new Date().toISOString().slice(0, 10);
      const fileName = `ef-planner-backup-${today}.json`;
      await writeTextFile(`${backupDir}/${fileName}`, json);
      showSuccess(`Respaldo guardado en ${backupDir}/${fileName}`);
    } catch (error) {
      console.error("[Backup] Quick export error:", error);
      showError("No se pudo guardar el respaldo rápido. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImport() {
    setIsLoading(true);
    setMessage("");
    try {
      const result: ImportResult | null = await importActivitiesBackup();
      if (result === null) {
        showInfo("Operación cancelada.");
      } else {
        showSuccess(
          `Importación completada. Actividades importadas: ${result.imported}. Omitidas por duplicado: ${result.skipped}.`
        );
      }
    } catch (error) {
      console.error("[Backup] Import error:", error);
      showError("No se pudo importar el respaldo. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">Respaldos</h1>
        <p className="search-page-subtitle">Exporta o importa tus actividades pedagógicas</p>
      </div>

      {backupDir ? (
        <div className="backup-dir-info">
          Carpeta configurada: {backupDir}
        </div>
      ) : (
        <div className="backup-dir-info backup-dir-warning">
          Aún no has configurado una carpeta de respaldos. Puedes hacerlo en Configuración.
        </div>
      )}

      {isLoading && (
        <div className="search-empty">
          <p>Procesando...</p>
        </div>
      )}

      {message && (
        <div className={`backup-message backup-message-${messageType}`}>
          {message}
        </div>
      )}

      <div className="cards-grid">
        {backupDir && (
          <div className="backup-card">
            <span className="backup-card-icon">⚡</span>
            <h3 className="backup-card-title">Respaldo rápido</h3>
            <p className="backup-card-desc">
              Guarda el respaldo directamente en tu carpeta configurada sin preguntar ubicación.
            </p>
            <button
              type="button"
              className="backup-btn"
              onClick={handleQuickExport}
              disabled={isLoading}
            >
              Guardar en carpeta configurada
            </button>
          </div>
        )}

        <div className="backup-card">
          <span className="backup-card-icon">📤</span>
          <h3 className="backup-card-title">Exportar respaldo</h3>
          <p className="backup-card-desc">
            Guarda todas tus actividades en un archivo JSON. Elige dónde guardarlo.
          </p>
          <button
            type="button"
            className="backup-btn"
            onClick={handleExport}
            disabled={isLoading}
          >
            Exportar actividades
          </button>
        </div>

        <div className="backup-card">
          <span className="backup-card-icon">📥</span>
          <h3 className="backup-card-title">Importar respaldo</h3>
          <p className="backup-card-desc">
            Restaura actividades desde un archivo JSON exportado previamente. No duplica actividades existentes.
          </p>
          <button
            type="button"
            className="backup-btn"
            onClick={handleImport}
            disabled={isLoading}
          >
            Importar respaldo
          </button>
        </div>
      </div>

      <button className="back-btn" onClick={onBack}>← Volver</button>
    </div>
  );
}

export default BackupPage;
