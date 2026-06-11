import { useState } from "react";
import { Activity } from "../types/activity";
import {
  CLASS_MOMENTS,
  PHYSICAL_CAPACITIES,
  INTENSITY_LEVELS,
  SPACES,
  COMMON_EQUIPMENT,
  SUGGESTED_GRADES,
} from "../../../shared/constants/pedagogicalOptions";
import { toggleFavorite, deleteActivity } from "../services/activityRepository";
import "./ActivityDetailPage.css";

interface ActivityDetailPageProps {
  activity: Activity;
  onBack: () => void;
  onEdit: (activity: Activity) => void;
  onDeleted: () => void;
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

function ActivityDetailPage({ activity, onBack, onEdit, onDeleted }: ActivityDetailPageProps) {
  const [localActivity, setLocalActivity] = useState<Activity>(activity);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleToggleFavorite() {
    try {
      const newState = !localActivity.isFavorite;
      await toggleFavorite(localActivity.id, newState);
      setLocalActivity({ ...localActivity, isFavorite: newState });
    } catch (error) {
      console.error("[Detail] Error al cambiar favorito:", error);
    }
  }

  const handleDeleteClick = () => {
    setDeleteError("");
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteActivity(activity.id);
      setShowDeleteConfirm(false);
      onDeleted();
    } catch (error) {
      console.error("[UI] Failed to delete activity", error);
      setDeleteError("No se pudo eliminar la actividad. Revisa la consola.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Volver a búsqueda
        </button>
        <div className="detail-title-row">
          <h1 className="detail-title">{localActivity.name}</h1>
          {localActivity.isFavorite && <span className="detail-favorite">⭐ Favorita</span>}
        </div>
        <div className="detail-tags">
          <span className="dtag">{getLabel(CLASS_MOMENTS, localActivity.classMoment)}</span>
          <span className="dtag">{getLabel(PHYSICAL_CAPACITIES, localActivity.physicalCapacity)}</span>
          <span className="dtag">{getLabel(INTENSITY_LEVELS, localActivity.intensity)}</span>
        </div>
      </div>

      <Section title="Información general">
        <Field label="Objetivo principal" value={localActivity.primaryObjective} />
        {localActivity.secondaryObjective && (
          <Field label="Objetivo secundario" value={localActivity.secondaryObjective} />
        )}
      </Section>

      <Section title="Parámetros de ejecución">
        <div className="detail-grid">
          <Field label="Participantes" value={`${localActivity.minParticipants} – ${localActivity.maxParticipants}`} />
          <Field label="Duración" value={`${localActivity.durationMinutes} minutos`} />
          <Field label="Intensidad" value={getLabel(INTENSITY_LEVELS, localActivity.intensity)} />
          <Field label="Espacio" value={getLabel(SPACES, localActivity.space)} />
        </div>
        <Field
          label="Cursos sugeridos"
          value={
            localActivity.suggestedGrades.length > 0
              ? localActivity.suggestedGrades.map(getGradeLabel).join(", ")
              : "No especificado"
          }
        />
        <Field
          label="Implementos"
          value={
            localActivity.equipment.length > 0
              ? localActivity.equipment.map(getEquipmentLabel).join(", ")
              : "Ninguno"
          }
        />
      </Section>

      <Section title="Contenido pedagógico">
        <Field label="Descripción" value={localActivity.description} />
        <Field label="Organización" value={localActivity.organization} />
        {localActivity.variants.length > 0 && (
          <div className="detail-field">
            <span className="detail-field-label">Variantes</span>
            <ul className="detail-list">
              {localActivity.variants.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Seguridad y evaluación">
        <Field label="Notas de seguridad" value={localActivity.safetyNotes} />
        {localActivity.observationCriteria.length > 0 && (
          <div className="detail-field">
            <span className="detail-field-label">Criterios de observación</span>
            <ul className="detail-list">
              {localActivity.observationCriteria.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {localActivity.tags.length > 0 && (
        <div className="detail-tags-footer">
          {localActivity.tags.map((tag) => (
            <span key={tag} className="dtag dtag-small">{tag}</span>
          ))}
        </div>
      )}

      <div className="detail-meta">
        <span>Creado: {formatDate(localActivity.createdAt)}</span>
        <span>Actualizado: {formatDate(localActivity.updatedAt)}</span>
      </div>

      <div className="detail-actions">
        <button className="detail-edit-btn" onClick={() => onEdit(localActivity)}>
          Editar actividad
        </button>
        <button
          className="detail-fav-btn"
          onClick={handleToggleFavorite}
        >
          {localActivity.isFavorite ? "Quitar de favoritas" : "Marcar como favorita"}
        </button>
        <button
          type="button"
          className="detail-del-btn"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          {isDeleting ? "Eliminando..." : "Eliminar actividad"}
        </button>
      </div>

      {deleteError && (
        <div className="detail-error">{deleteError}</div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Eliminar actividad</h2>
            <p className="modal-text">
              ¿Seguro que quieres eliminar la actividad «{activity.name}»? Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="modal-confirm-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={onBack}>
        ← Volver a búsqueda
      </button>
    </div>
  );
}

export default ActivityDetailPage;
