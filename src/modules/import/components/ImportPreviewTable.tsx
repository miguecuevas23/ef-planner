import { ImportPreviewItem } from "../types/importTypes";

interface ImportPreviewTableProps {
  items: ImportPreviewItem[];
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onViewDetail: (item: ImportPreviewItem) => void;
}

const STATUS_LABELS: Record<string, string> = {
  ok: "Lista",
  warning: "Advertencias",
  error: "Errores",
  duplicate: "Posible duplicado",
};

function ImportPreviewTable({ items, onToggle, onSelectAll, onDeselectAll, onViewDetail }: ImportPreviewTableProps) {
  const selectableCount = items.filter((i) => i.status !== "error").length;

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
                  <button
                    type="button"
                    className="import-detail-btn"
                    onClick={() => onViewDetail(item)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ImportPreviewTable;
