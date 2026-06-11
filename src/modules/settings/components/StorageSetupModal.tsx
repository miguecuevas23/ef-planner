import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { setSetting } from "../../../database/metadataRepository";
import "./StorageSetupModal.css";

interface StorageSetupModalProps {
  onComplete: () => void;
}

function StorageSetupModal({ onComplete }: StorageSetupModalProps) {
  const [backupDir, setBackupDir] = useState<string | null>(null);

  async function handleChooseFolder() {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Elegir carpeta de respaldos",
    });
    if (selected) {
      setBackupDir(selected as string);
    }
  }

  async function handleContinue() {
    if (backupDir) {
      await setSetting("backup_directory", backupDir);
    }
    await setSetting("storage_setup_completed", "true");
    onComplete();
  }

  async function handleSkip() {
    await setSetting("storage_setup_completed", "true");
    onComplete();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Ubicación de tus datos y respaldos</h2>
        <p className="modal-text">
          EF Planner guarda tus actividades, favoritos y configuraciones localmente en este dispositivo. Para mayor seguridad, puedes elegir una carpeta donde guardar tus respaldos JSON.
        </p>

        <div className="setup-info-section">
          <div className="setup-info-field">
            <span className="setup-info-label">Almacenamiento local</span>
            <span className="setup-info-value">SQLite interno de la app</span>
          </div>
          <div className="setup-info-field">
            <span className="setup-info-label">Carpeta de respaldos</span>
            <span className="setup-info-value" style={backupDir ? {} : { color: "#aaa" }}>
              {backupDir || "No configurada"}
            </span>
          </div>
        </div>

        <button type="button" className="setup-folder-btn" onClick={handleChooseFolder}>
          {backupDir ? "Cambiar carpeta" : "Elegir carpeta de respaldos"}
        </button>

        <div className="modal-actions">
          <button type="button" className="modal-cancel-btn" onClick={handleSkip}>
            Usar por ahora sin carpeta
          </button>
          <button type="button" className="modal-confirm-btn" onClick={handleContinue}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

export default StorageSetupModal;
