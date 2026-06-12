import { useState } from "react";
import { getAllActivities, createActivity } from "../../activities/services/activityRepository";
import { ImportPreviewItem, ImportFileType } from "../types/importTypes";
import { parseJsonFile, parseTxtFile } from "../services/importParsers";
import { normalizeActivity, detectDuplicates } from "../services/importValidators";
import ImportPreviewTable from "../components/ImportPreviewTable";
import HomeButton from "../../../shared/components/HomeButton";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./ImportActivitiesPage.css";

interface PageProps {
  onBack: () => void;
}

const ACCEPTED_EXTENSIONS = ["json", "txt"];

function ImportActivitiesPage({ onBack }: PageProps) {
  const [step, setStep] = useState<"select" | "preview" | "done">("select");
  const [fileType, setFileType] = useState<ImportFileType | null>(null);
  const [previewItems, setPreviewItems] = useState<ImportPreviewItem[]>([]);
  const [detailItem, setDetailItem] = useState<ImportPreviewItem | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSelectFile() {
    setErrorMsg("");
    setIsLoading(true);

    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const selected = await open({
        multiple: false,
        filters: [{ name: "Actividades", extensions: ACCEPTED_EXTENSIONS }],
        title: "Seleccionar archivo de actividades",
      });

      if (!selected) {
        setIsLoading(false);
        return;
      }

      const filePath = selected as string;
      const extension = filePath.split(".").pop()?.toLowerCase();

      if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
        setErrorMsg("Formato de archivo no soportado. Usa .json o .txt.");
        setIsLoading(false);
        return;
      }

      const { readTextFile } = await import("@tauri-apps/plugin-fs");
      const content = await readTextFile(filePath);

      let rawActivities;
      if (extension === "json") {
        rawActivities = parseJsonFile(content);
        setFileType("json");
      } else {
        rawActivities = parseTxtFile(content);
        setFileType("txt");
      }

      const existingActivities = await getAllActivities();
      const items = rawActivities.map((raw, i) => normalizeActivity(raw, i));
      detectDuplicates(items, existingActivities);

      setPreviewItems(items);
      setStep("preview");
    } catch (error) {
      console.error("[Import] File error:", error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Error al leer el archivo. Verifica el formato."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggle(index: number) {
    setPreviewItems((prev) =>
      prev.map((item) =>
        item.index === index && item.status !== "error"
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  }

  function handleSelectAll() {
    setPreviewItems((prev) =>
      prev.map((item) =>
        item.status !== "error" ? { ...item, selected: true } : item
      )
    );
  }

  function handleDeselectAll() {
    setPreviewItems((prev) =>
      prev.map((item) => ({ ...item, selected: false }))
    );
  }

  function handleViewDetail(item: ImportPreviewItem) {
    setDetailItem(item);
  }

  function handleCloseDetail() {
    setDetailItem(null);
  }

  async function handleImportSelected() {
    const selected = previewItems.filter((i) => i.selected && i.activity);
    if (selected.length === 0) return;

    setIsLoading(true);
    let success = 0;
    let failed = 0;

    for (const item of selected) {
      try {
        await createActivity(item.activity!);
        success++;
      } catch (error) {
        console.error(`[Import] Failed to import "${item.activity?.name}":`, error);
        failed++;
      }
    }

    setImportResult({ success, failed });
    setStep("done");
    setIsLoading(false);
  }

  function handleCancel() {
    setPreviewItems([]);
    setFileType(null);
    setErrorMsg("");
    setStep("select");
  }

  if (step === "done" && importResult) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <button className="back-btn" onClick={onBack}>← Volver</button>
          <HomeButton onClick={onBack} />
          <h1 className="search-page-title">Importar actividades</h1>
          <p className="search-page-subtitle">Resultado de la importación</p>
        </div>

        <div className="import-result-card">
          <div className="import-result-icon">✅</div>
          <h2 className="import-result-title">Importación completada</h2>
          <p className="import-result-text">
            Se importaron <strong>{importResult.success}</strong>{" "}
            actividad{importResult.success !== 1 ? "es" : ""} correctamente.
          </p>
          {importResult.failed > 0 && (
            <p className="import-result-errors">
              {importResult.failed} actividad{importResult.failed !== 1 ? "es" : ""} no{" "}
              pudieron importarse. Revisa los errores.
            </p>
          )}
          <button className="import-btn" onClick={onBack}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <button className="back-btn" onClick={handleCancel}>← Cancelar</button>
          <HomeButton onClick={onBack} />
          <h1 className="search-page-title">Importar actividades</h1>
          <p className="search-page-subtitle">
            {fileType === "json" ? "Archivo JSON" : "Archivo TXT"} — Vista previa
          </p>
        </div>

        <ImportPreviewTable
          items={previewItems}
          onToggle={handleToggle}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onViewDetail={handleViewDetail}
        />

        <div className="import-bottom-bar">
          <button className="back-btn" onClick={handleCancel}>
            Cancelar
          </button>
          <button
            className="import-btn import-btn-primary"
            onClick={handleImportSelected}
            disabled={isLoading || previewItems.filter((i) => i.selected).length === 0}
          >
            {isLoading
              ? "Importando..."
              : `Importar seleccionadas (${previewItems.filter((i) => i.selected).length})`}
          </button>
        </div>

        {detailItem && (
          <div className="modal-overlay" onClick={handleCloseDetail}>
            <div className="modal-box import-detail-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">
                {detailItem.raw.title ?? "Sin título"}
              </h2>

              <div className="import-detail-fields">
                {detailItem.raw.description && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Descripción</span>
                    <span className="import-detail-value">{detailItem.raw.description}</span>
                  </div>
                )}
                {detailItem.raw.objective && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Objetivo</span>
                    <span className="import-detail-value">{detailItem.raw.objective}</span>
                  </div>
                )}
                {detailItem.raw.moment && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Momento</span>
                    <span className="import-detail-value">{detailItem.raw.moment}</span>
                  </div>
                )}
                {detailItem.raw.physicalCapacity && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Capacidad</span>
                    <span className="import-detail-value">{detailItem.raw.physicalCapacity}</span>
                  </div>
                )}
                {detailItem.raw.intensity && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Intensidad</span>
                    <span className="import-detail-value">{detailItem.raw.intensity}</span>
                  </div>
                )}
                {detailItem.raw.space && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Espacio</span>
                    <span className="import-detail-value">{detailItem.raw.space}</span>
                  </div>
                )}
                {detailItem.raw.materials && detailItem.raw.materials.length > 0 && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Materiales</span>
                    <span className="import-detail-value">{detailItem.raw.materials.join(", ")}</span>
                  </div>
                )}
                {detailItem.raw.minStudents !== undefined && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Estudiantes mín.</span>
                    <span className="import-detail-value">{detailItem.raw.minStudents}</span>
                  </div>
                )}
                {detailItem.raw.suggestedGrades && detailItem.raw.suggestedGrades.length > 0 && (
                  <div className="import-detail-field">
                    <span className="import-detail-label">Cursos</span>
                    <span className="import-detail-value">{detailItem.raw.suggestedGrades.join(", ")}</span>
                  </div>
                )}
              </div>

              {(detailItem.warnings.length > 0 || detailItem.errors.length > 0) && (
                <div className="import-detail-issues">
                  {detailItem.errors.map((e, i) => (
                    <p key={`err-${i}`} className="import-issue import-issue-error">❌ {e}</p>
                  ))}
                  {detailItem.warnings.map((w, i) => (
                    <p key={`warn-${i}`} className="import-issue import-issue-warning">⚠️ {w}</p>
                  ))}
                </div>
              )}

              <button className="modal-cancel-btn" onClick={handleCloseDetail}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">Importar actividades</h1>
        <p className="search-page-subtitle">Carga actividades desde archivos JSON o TXT estructurados</p>
      </div>

      <div className="import-select-card">
        <div className="import-select-icon">📂</div>
        <h2 className="import-select-title">Seleccionar archivo</h2>
        <p className="import-select-desc">
          Formatos soportados: <strong>JSON</strong> y <strong>TXT</strong> estructurado.
          Cada archivo puede contener una o varias actividades.
        </p>

        <button
          className="import-btn import-btn-primary import-btn-large"
          onClick={handleSelectFile}
          disabled={isLoading}
        >
          {isLoading ? "Abriendo..." : "Seleccionar archivo"}
        </button>

        <div className="import-format-info">
          <p>Formatos aceptados:</p>
          <ul>
            <li><strong>JSON:</strong> array de actividades o {"{ activities: [...] }"}</li>
            <li><strong>TXT:</strong> actividades separadas por "---" con campos Clave: Valor</li>
          </ul>
        </div>
      </div>

      {errorMsg && (
        <div className="import-error-msg">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

export default ImportActivitiesPage;
