import { Activity } from "../types/activity";
import {
  CLASS_MOMENTS,
  PHYSICAL_CAPACITIES,
  INTENSITY_LEVELS,
  SPACES,
  COMMON_EQUIPMENT,
  SUGGESTED_GRADES,
} from "../../../shared/constants/pedagogicalOptions";
import "./ActivityDetailPage.css";

interface ActivityDetailPageProps {
  activity: Activity;
  onBack: () => void;
}

function getLabel(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function getGradeLabel(value: string): string {
  return getLabel(SUGGESTED_GRADES, value);
}

function getEquipmentLabel(value: string): string {
  return getLabel(COMMON_EQUIPMENT, value);
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="detail-section">
      <h2 className="detail-section-title">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-field">
      <span className="detail-field-label">{label}</span>
      <span className="detail-field-value">{value}</span>
    </div>
  );
}

function ActivityDetailPage({ activity, onBack }: ActivityDetailPageProps) {
  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Volver a búsqueda
        </button>
        <div className="detail-title-row">
          <h1 className="detail-title">{activity.name}</h1>
          {activity.isFavorite && <span className="detail-favorite">⭐ Favorita</span>}
        </div>
        <div className="detail-tags">
          <span className="dtag">{getLabel(CLASS_MOMENTS, activity.classMoment)}</span>
          <span className="dtag">{getLabel(PHYSICAL_CAPACITIES, activity.physicalCapacity)}</span>
          <span className="dtag">{getLabel(INTENSITY_LEVELS, activity.intensity)}</span>
        </div>
      </div>

      <Section title="Información general">
        <Field label="Objetivo principal" value={activity.primaryObjective} />
        {activity.secondaryObjective && (
          <Field label="Objetivo secundario" value={activity.secondaryObjective} />
        )}
      </Section>

      <Section title="Parámetros de ejecución">
        <div className="detail-grid">
          <Field label="Participantes" value={`${activity.minParticipants} – ${activity.maxParticipants}`} />
          <Field label="Duración" value={`${activity.durationMinutes} minutos`} />
          <Field label="Intensidad" value={getLabel(INTENSITY_LEVELS, activity.intensity)} />
          <Field label="Espacio" value={getLabel(SPACES, activity.space)} />
        </div>
        <Field
          label="Cursos sugeridos"
          value={
            activity.suggestedGrades.length > 0
              ? activity.suggestedGrades.map(getGradeLabel).join(", ")
              : "No especificado"
          }
        />
        <Field
          label="Implementos"
          value={
            activity.equipment.length > 0
              ? activity.equipment.map(getEquipmentLabel).join(", ")
              : "Ninguno"
          }
        />
      </Section>

      <Section title="Contenido pedagógico">
        <Field label="Descripción" value={activity.description} />
        <Field label="Organización" value={activity.organization} />
        {activity.variants.length > 0 && (
          <div className="detail-field">
            <span className="detail-field-label">Variantes</span>
            <ul className="detail-list">
              {activity.variants.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Seguridad y evaluación">
        <Field label="Notas de seguridad" value={activity.safetyNotes} />
        {activity.observationCriteria.length > 0 && (
          <div className="detail-field">
            <span className="detail-field-label">Criterios de observación</span>
            <ul className="detail-list">
              {activity.observationCriteria.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {activity.tags.length > 0 && (
        <div className="detail-tags-footer">
          {activity.tags.map((tag) => (
            <span key={tag} className="dtag dtag-small">{tag}</span>
          ))}
        </div>
      )}

      <div className="detail-meta">
        <span>Creado: {formatDate(activity.createdAt)}</span>
        <span>Actualizado: {formatDate(activity.updatedAt)}</span>
      </div>

      <div className="detail-actions">
        <button className="detail-edit-btn" onClick={() => {}}>
          Editar actividad
        </button>
      </div>
    </div>
  );
}

export default ActivityDetailPage;
