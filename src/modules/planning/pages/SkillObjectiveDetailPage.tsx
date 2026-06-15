import { useState, useEffect } from "react";
import HomeButton from "../../../shared/components/HomeButton";
import { SkillObjective } from "../types/skillObjective";
import { getSkillObjectiveById, toggleSkillObjectiveFavorite, deleteSkillObjective, duplicateSkillObjective } from "../services/skillObjectiveRepository";
import { getBloomLevelData } from "../services/bloomTaxonomyService";
import { PHYSICAL_EDUCATION_SKILLS, PHYSICAL_CAPACITIES, GRADE_LABELS } from "../constants/physicalEducationSkills";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./PlanningComingSoonPage.css";

interface PageProps {
  onBack: () => void;
  skillId: string;
  onEdit: (id: string) => void;
}

function SkillObjectiveDetailPage({ onBack, skillId, onEdit }: PageProps) {
  const [item, setItem] = useState<SkillObjective | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getSkillObjectiveById(skillId).then(setItem);
  }, [skillId]);

  if (!item) {
    return (
      <div className="search-page">
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.8)" }}>Cargando…</p>
      </div>
    );
  }

  const bloomData = getBloomLevelData(item.bloomLevel);
  const categoryLabel = PHYSICAL_EDUCATION_SKILLS.find((c) => c.value === item.skillCategory)?.label ?? item.skillCategory;

  async function handleToggleFavorite() {
    await toggleSkillObjectiveFavorite(item!.id);
    const updated = await getSkillObjectiveById(item!.id);
    if (updated) setItem(updated);
  }

  async function handleDelete() {
    await deleteSkillObjective(item!.id);
    onBack();
  }

  async function handleDuplicate() {
    await duplicateSkillObjective(item!.id);
    onBack();
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">Detalle de habilidad</h1>
      </div>

      <div className="skill-card" style={{ marginBottom: "1rem" }}>
        <div className="detail-skill-text">{item.skillText}</div>
        {item.isFavorite && <span className="skill-card-tag skill-card-tag-favorite" style={{ marginTop: "0.5rem", display: "inline-block" }}>★ Favorita</span>}
      </div>

      <div className="settings-section">
        <div className="settings-field">
          <span className="settings-label">Nivel educativo</span>
          <span className="settings-value">{item.educationLevel === "basic" ? "Básica" : "Media"}</span>
        </div>
        <div className="settings-field">
          <span className="settings-label">Cursos</span>
          <span className="settings-value">
            {item.grades.map((g) => (GRADE_LABELS[g.grade] || g.grade) + (g.isPrimary ? " (principal)" : "")).join(", ")}
          </span>
        </div>
        <div className="settings-field">
          <span className="settings-label">Proceso cognitivo</span>
          <span className="settings-value">{item.bloomLevel}</span>
        </div>
        <div className="settings-field">
          <span className="settings-label">Verbo</span>
          <span className="settings-value">{item.verb}</span>
        </div>
        <div className="settings-field">
          <span className="settings-label">Categoría</span>
          <span className="settings-value">{categoryLabel}</span>
        </div>
        {item.physicalCapacity && (
          <div className="settings-field">
            <span className="settings-label">Capacidad</span>
            <span className="settings-value">{PHYSICAL_CAPACITIES.find((c) => c.value === item.physicalCapacity)?.label ?? item.physicalCapacity}</span>
          </div>
        )}
        <div className="settings-field">
          <span className="settings-label">Patrón o habilidad</span>
          <span className="settings-value">{item.skillDetail}</span>
        </div>
        {item.contextCondition && (
          <div className="settings-field">
            <span className="settings-label">Contexto</span>
            <span className="settings-value">{item.contextCondition}</span>
          </div>
        )}
        <div className="settings-field">
          <span className="settings-label">Estado</span>
          <span className="settings-value">{item.status === "draft" ? "Borrador" : item.status === "ready" ? "Lista" : "Archivada"}</span>
        </div>
      </div>

      {item.customFinalText && (
        <div className="settings-section">
          <h2 className="settings-section-title">Versión personalizada</h2>
          <div className="detail-section-box">{item.customFinalText}</div>
        </div>
      )}

      <div className="settings-section">
        <h2 className="settings-section-title">Versión generada</h2>
        <div className="detail-section-box">{item.generatedText}</div>
      </div>

      {bloomData && (
        <div className="settings-section">
          <h2 className="settings-section-title">Taxonomía de Bloom</h2>
          <div className="detail-section-box">{bloomData.description}</div>
        </div>
      )}

      {item.notes && (
        <div className="settings-section">
          <h2 className="settings-section-title">Notas</h2>
          <div className="detail-section-box">{item.notes}</div>
        </div>
      )}

      <div className="detail-actions" style={{ justifyContent: "flex-start", marginBottom: "1rem" }}>
        <button className="detail-edit-btn" onClick={() => onEdit(item.id)}>Editar</button>
        <button className="detail-edit-btn" onClick={handleDuplicate}>Duplicar</button>
        <button className="detail-edit-btn" onClick={handleToggleFavorite}>{item.isFavorite ? "★ Quitar favorita" : "☆ Marcar favorita"}</button>
        <button className="detail-del-btn" onClick={() => setConfirmDelete(true)}>Eliminar</button>
      </div>

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Eliminar habilidad</h2>
            <p className="modal-text">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setConfirmDelete(false)}>Cancelar</button>
              <button className="modal-confirm-btn" onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Volver</button>
    </div>
  );
}

export default SkillObjectiveDetailPage;
