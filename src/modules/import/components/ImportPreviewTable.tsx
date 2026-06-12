import { useState } from "react";
import { ImportPreviewItem, ImportActivity } from "../types/importTypes";
import {
  CLASS_MOMENTS,
  PHYSICAL_CAPACITIES,
  INTENSITY_LEVELS,
  SPACES,
  SUGGESTED_GRADES,
} from "../../../shared/constants/pedagogicalOptions";

interface ImportPreviewTableProps {
  items: ImportPreviewItem[];
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onViewDetail: (item: ImportPreviewItem) => void;
  onSaveEdit: (index: number, editedData: ImportActivity) => void;
}

const STATUS_LABELS: Record<string, string> = {
  ok: "Lista",
  warning: "Advertencias",
  error: "Errores",
  duplicate: "Posible duplicado",
};

function ImportPreviewTable({
  items,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onViewDetail,
  onSaveEdit,
}: ImportPreviewTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<ImportActivity>({});

  const selectableCount = items.filter((i) => i.status !== "error").length;

  function handleOpenEdit(item: ImportPreviewItem) {
    setEditingIndex(item.index);
    setEditData({
      title: item.raw.title ?? "",
      description: item.raw.description ?? "",
      objective: item.raw.objective ?? "",
      moment: item.raw.moment ?? "",
      physicalCapacity: item.raw.physicalCapacity ?? "",
      intensity: item.raw.intensity ?? "",
      space: item.raw.space ?? "",
      materials: item.raw.materials ?? [],
      minStudents: item.raw.minStudents ?? 2,
      suggestedGrades: item.raw.suggestedGrades ?? [],
    });
  }

  function handleCloseEdit() {
    setEditingIndex(null);
    setEditData({});
  }

  function handleSaveEdit() {
    if (editingIndex !== null) {
      onSaveEdit(editingIndex, editData);
    }
    handleCloseEdit();
  }

  function updateField(field: keyof ImportActivity, value: unknown) {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleGrade(grade: string) {
    setEditData((prev) => {
      const current = prev.suggestedGrades ?? [];
      const exists = current.includes(grade);
      return {
        ...prev,
        suggestedGrades: exists ? current.filter((g) => g !== grade) : [...current, grade],
      };
    });
  }

  function handleMaterialsChange(value: string) {
    const list = value
      .split(/,\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
    updateField("materials", list);
  }

  return (
    <div className="import-preview">
      <div className="import-actions-bar">
        <span className="import-count">
          {items.length} actividad{items.length !== 1 ? "es" : ""} encontrada{items.length !== 1 ? "s" : ""}
        </span>
        <div className="import-actions-btns">
          <button type="button" className="import-btn-sm" onClick={onSelectAll} disabled={selectableCount === 0}>
            Seleccionar todas
          </button>
          <button type="button" className="import-btn-sm import-btn-sm-outline" onClick={onDeselectAll}>
            Deseleccionar todas
          </button>
        </div>
      </div>

      <div className="import-table-wrapper">
        <table className="import-table">
          <thead>
            <tr>
              <th className="col-check"></th>
              <th className="col-title">Título</th>
              <th className="col-moment">Momento</th>
              <th className="col-capacity">Capacidad</th>
              <th className="col-students">Est.</th>
              <th className="col-grades">Cursos</th>
              <th className="col-status">Estado</th>
              <th className="col-detail"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.index} className={`import-row import-row-${item.status}`}>
                <td className="col-check">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    disabled={item.status === "error"}
                    onChange={() => onToggle(item.index)}
                  />
                </td>
                <td className="col-title">{item.raw.title ?? <em className="import-missing">Sin título</em>}</td>
                <td className="col-moment">{item.raw.moment ?? "-"}</td>
                <td className="col-capacity">{item.raw.physicalCapacity ?? "-"}</td>
                <td className="col-students">{item.raw.minStudents ?? 2}</td>
                <td className="col-grades">
                  {item.raw.suggestedGrades?.join(", ") ?? "-"}
                </td>
                <td className="col-status">
                  <span className={`import-status import-status-${item.status}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                  {(item.warnings.length > 0 || item.errors.length > 0) && (
                    <span className="import-issues-icon" title={[...item.warnings, ...item.errors].join("\n")}>
                      ⚠️
                    </span>
                  )}
                </td>
                <td className="col-detail">
                  <button type="button" className="import-detail-btn" onClick={() => onViewDetail(item)}>
                    Ver
                  </button>
                  <button type="button" className="import-detail-btn" onClick={() => handleOpenEdit(item)} style={{ marginLeft: 4 }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingIndex !== null && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal-box import-edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Editar actividad</h2>

            <div className="import-edit-field">
              <label className="import-edit-label">Título</label>
              <input
                className="import-edit-input"
                type="text"
                value={editData.title ?? ""}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Descripción</label>
              <textarea
                className="import-edit-input import-edit-textarea"
                value={editData.description ?? ""}
                onChange={(e) => updateField("description", e.target.value)}
                rows={2}
              />
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Objetivo</label>
              <textarea
                className="import-edit-input import-edit-textarea"
                value={editData.objective ?? ""}
                onChange={(e) => updateField("objective", e.target.value)}
                rows={2}
              />
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Momento de clase</label>
              <select
                className="import-edit-select"
                value={editData.moment ?? ""}
                onChange={(e) => updateField("moment", e.target.value)}
              >
                <option value="">—</option>
                {CLASS_MOMENTS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Capacidad física</label>
              <select
                className="import-edit-select"
                value={editData.physicalCapacity ?? ""}
                onChange={(e) => updateField("physicalCapacity", e.target.value)}
              >
                <option value="">—</option>
                {PHYSICAL_CAPACITIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Intensidad</label>
              <select
                className="import-edit-select"
                value={editData.intensity ?? ""}
                onChange={(e) => updateField("intensity", e.target.value)}
              >
                <option value="">—</option>
                {INTENSITY_LEVELS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Espacio</label>
              <select
                className="import-edit-select"
                value={editData.space ?? ""}
                onChange={(e) => updateField("space", e.target.value)}
              >
                <option value="">—</option>
                {SPACES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Materiales (separados por coma)</label>
              <input
                className="import-edit-input"
                type="text"
                value={editData.materials?.join(", ") ?? ""}
                onChange={(e) => handleMaterialsChange(e.target.value)}
              />
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Estudiantes mínimos</label>
              <input
                className="import-edit-input"
                type="number"
                min={1}
                value={editData.minStudents ?? 2}
                onChange={(e) => updateField("minStudents", Math.max(1, parseInt(e.target.value, 10) || 2))}
              />
            </div>

            <div className="import-edit-field">
              <label className="import-edit-label">Cursos sugeridos</label>
              <div className="import-edit-grades">
                {SUGGESTED_GRADES.map((g) => (
                  <label key={g.value} className="import-edit-grade-label">
                    <input
                      type="checkbox"
                      checked={editData.suggestedGrades?.includes(g.value) ?? false}
                      onChange={() => toggleGrade(g.value)}
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="import-edit-actions">
              <button type="button" className="import-edit-cancel-btn" onClick={handleCloseEdit}>
                Cancelar
              </button>
              <button type="button" className="import-edit-save-btn" onClick={handleSaveEdit}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportPreviewTable;
