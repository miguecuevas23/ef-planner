import { useState, useEffect } from "react";
import { APP_VERSION, APP_CHANNEL } from "../../../shared/constants/appVersion";
import { getSchemaVersion } from "../../../database/metadataRepository";
import {
  getCheckUpdatesOnStartup,
  setCheckUpdatesOnStartup,
  getUpdateChannel,
  setUpdateChannel,
} from "../services/updatePreferencesService";
import { checkForUpdates } from "../services/updateService";
import { UpdateStatus } from "../types/update";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./SettingsPage.css";

interface PageProps {
  onBack: () => void;
}

function SettingsPage({ onBack }: PageProps) {
  const [schemaVersion, setSchemaVersion] = useState<number>(0);
  const [checkUpdates, setCheckUpdates] = useState(true);
  const [channel, setChannel] = useState<"beta" | "stable">("beta");
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    async function load() {
      const sv = await getSchemaVersion();
      setSchemaVersion(sv);
      const cu = await getCheckUpdatesOnStartup();
      setCheckUpdates(cu);
      const ch = await getUpdateChannel();
      setChannel(ch);
    }
    load();
  }, []);

  async function handleToggleCheckUpdates() {
    const next = !checkUpdates;
    await setCheckUpdatesOnStartup(next);
    setCheckUpdates(next);
  }

  async function handleChannelChange(value: "beta" | "stable") {
    await setUpdateChannel(value);
    setChannel(value);
  }

  async function handleCheckUpdates() {
    setUpdateStatus("checking");
    setUpdateMessage("Buscando actualizaciones...");
    const result = await checkForUpdates();
    setUpdateStatus(result.status);
    setUpdateMessage(result.message);
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1 className="search-page-title">Configuración</h1>
        <p className="search-page-subtitle">Versión beta para pruebas internas</p>
      </div>

      <div className="settings-section">
        <div className="settings-field">
          <span className="settings-label">Versión de la app</span>
          <span className="settings-value">{APP_VERSION}</span>
        </div>

        <div className="settings-field">
          <span className="settings-label">Canal actual</span>
          <span className="settings-channel-badge">{APP_CHANNEL}</span>
        </div>

        <div className="settings-field">
          <span className="settings-label">Versión del esquema de datos</span>
          <span className="settings-value">{schemaVersion}</span>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-section-title">Actualizaciones</h2>

        <div className="settings-field">
          <span className="settings-label">Buscar actualizaciones</span>
          <button
            type="button"
            className="settings-update-btn"
            onClick={handleCheckUpdates}
            disabled={updateStatus === "checking" || updateStatus === "installing"}
          >
            {updateStatus === "checking" ? "Buscando..." : "Buscar actualizaciones"}
          </button>
        </div>

        {updateMessage && (
          <div className={`settings-update-msg settings-update-${updateStatus}`}>
            {updateMessage}
          </div>
        )}

        <div className="settings-field">
          <span className="settings-label">Buscar al iniciar</span>
          <button
            type="button"
            className={`settings-toggle ${checkUpdates ? "active" : ""}`}
            onClick={handleToggleCheckUpdates}
          >
            {checkUpdates ? "Activado" : "Desactivado"}
          </button>
        </div>

        <div className="settings-field">
          <span className="settings-label">Canal</span>
          <div className="settings-channel-group">
            <button
              type="button"
              className={`settings-channel-btn ${channel === "beta" ? "active" : ""}`}
              onClick={() => handleChannelChange("beta")}
            >
              Beta
            </button>
            <button
              type="button"
              className={`settings-channel-btn ${channel === "stable" ? "active" : ""}`}
              onClick={() => handleChannelChange("stable")}
            >
              Estable
            </button>
          </div>
        </div>
      </div>

      <div className="settings-note">
        Versión beta para pruebas internas. Las actualizaciones nunca deben borrar tus actividades guardadas. Tus datos están protegidos en SQLite local.
      </div>

      <button className="back-btn" onClick={onBack}>← Volver</button>
    </div>
  );
}

export default SettingsPage;
