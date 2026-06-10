import { CLASS_MOMENTS, PHYSICAL_CAPACITIES, INTENSITY_LEVELS, SPACES, COMMON_EQUIPMENT, SUGGESTED_GRADES } from "../../../shared/constants/pedagogicalOptions";
import "./ActivityFormPage.css";

interface PageProps {
  onBack: () => void;
}

function ActivityFormPage({ onBack }: PageProps) {
  return (
    <div className="form-page">
      <div className="form-page-header">
        <h1 className="form-page-title">Nueva actividad</h1>
        <p className="form-page-subtitle">Completa los campos para crear una actividad pedagógica</p>
      </div>

      <form className="activity-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-section">
          <h2 className="form-section-title">Información general</h2>

          <div className="form-field">
            <label className="form-label">Nombre de la actividad</label>
            <input type="text" className="form-input" placeholder="Ej: Carrera de relevos" disabled />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Momento de la clase</label>
              <select className="form-input" disabled>
                <option value="">Seleccionar</option>
                {CLASS_MOMENTS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Capacidad física</label>
              <select className="form-input" disabled>
                <option value="">Seleccionar</option>
                {PHYSICAL_CAPACITIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Objetivo principal</label>
            <textarea className="form-input form-textarea" placeholder="Describe el objetivo pedagógico..." rows={2} disabled />
          </div>

          <div className="form-field">
            <label className="form-label">Objetivo secundario (opcional)</label>
            <textarea className="form-input form-textarea" placeholder="Objetivo complementario..." rows={2} disabled />
          </div>

          <div className="form-field">
            <label className="form-label">Cursos sugeridos</label>
            <div className="form-checkbox-group">
              {SUGGESTED_GRADES.map((g) => (
                <label key={g.value} className="form-checkbox-label">
                  <input type="checkbox" className="form-checkbox" disabled /> {g.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Parámetros de ejecución</h2>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Participantes mínimos</label>
              <input type="number" className="form-input" min={1} placeholder="2" disabled />
            </div>

            <div className="form-field">
              <label className="form-label">Participantes máximos</label>
              <input type="number" className="form-input" min={1} placeholder="40" disabled />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Duración (minutos)</label>
              <input type="number" className="form-input" min={1} placeholder="15" disabled />
            </div>

            <div className="form-field">
              <label className="form-label">Intensidad</label>
              <select className="form-input" disabled>
                <option value="">Seleccionar</option>
                {INTENSITY_LEVELS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Espacio</label>
            <select className="form-input" disabled>
              <option value="">Seleccionar</option>
              {SPACES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Implementos</label>
            <div className="form-checkbox-group">
              {COMMON_EQUIPMENT.map((e) => (
                <label key={e.value} className="form-checkbox-label">
                  <input type="checkbox" className="form-checkbox" disabled /> {e.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Contenido pedagógico</h2>

          <div className="form-field">
            <label className="form-label">Descripción</label>
            <textarea className="form-input form-textarea" placeholder="Describe la actividad en detalle..." rows={3} disabled />
          </div>

          <div className="form-field">
            <label className="form-label">Organización</label>
            <textarea className="form-input form-textarea" placeholder="Cómo se organizan los estudiantes, formaciones, distribución..." rows={2} disabled />
          </div>

          <div className="form-field">
            <label className="form-label">Variantes</label>
            <textarea className="form-input form-textarea" placeholder="Una variante por línea..." rows={2} disabled />
          </div>

          <div className="form-field">
            <label className="form-label">Notas de seguridad</label>
            <textarea className="form-input form-textarea" placeholder="Precauciones y medidas de seguridad..." rows={2} disabled />
          </div>

          <div className="form-field">
            <label className="form-label">Criterios de observación</label>
            <textarea className="form-input form-textarea" placeholder="Un criterio por línea..." rows={2} disabled />
          </div>
        </div>

        <div className="form-info">
          El formulario aún no guarda datos. Próximamente se conectará a la base de datos local.
        </div>
      </form>

      <button className="back-btn" onClick={onBack}>← Volver</button>
    </div>
  );
}

export default ActivityFormPage;
