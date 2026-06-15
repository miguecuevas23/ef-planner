import { useState, useEffect } from "react";
import HomeButton from "../../../shared/components/HomeButton";
import { SkillObjective } from "../types/skillObjective";
import { getAllSkillObjectives, toggleSkillObjectiveFavorite, deleteSkillObjective, duplicateSkillObjective } from "../services/skillObjectiveRepository";
import { GRADE_LABELS, PHYSICAL_EDUCATION_SKILLS, PHYSICAL_CAPACITIES } from "../constants/physicalEducationSkills";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./PlanningComingSoonPage.css";

interface PageProps {
  onBack: () => void;
  onEditSkill: (id: string) => void;
  onViewSkill: (id: string) => void;
}

function SkillObjectiveLibraryPage({ onBack, onEditSkill, onViewSkill }: PageProps) {
  const [items, setItems] = useState<SkillObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [bloomFilter, setBloomFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const all = await getAllSkillObjectives();
      setItems(all);
    } catch (e) {
      console.error("[Library] Load failed:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleToggleFavorite(id: string) {
    await toggleSkillObjectiveFavorite(id);
    load();
  }

  async function handleDelete(id: string) {
    await deleteSkillObjective(id);
    setConfirmDelete(null);
    load();
  }

  async function handleDuplicate(id: string) {
    await duplicateSkillObjective(id);
    load();
  }

  const filtered = items.filter((item) => {
    if (filter && !item.skillText.toLowerCase().includes(filter.toLowerCase())) return false;
    if (levelFilter && item.educationLevel !== levelFilter) return false;
    if (bloomFilter && item.bloomLevel !== bloomFilter) return false;
    if (categoryFilter && item.skillCategory !== categoryFilter) return false;
    if (capacityFilter && item.physicalCapacity !== capacityFilter) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    if (favoriteOnly && !item.isFavorite) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <button className="back-btn" onClick={onBack}>← Volver</button>
          <HomeButton onClick={onBack} />
          <h1 className="search-page-title">Biblioteca de habilidades</h1>
        </div>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.8)" }}>Cargando…</p>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">Biblioteca de habilidades</h1>
        <p className="search-page-subtitle">Componentes de Objetivo de Aprendizaje</p>
      </div>

      <div className="library-filters">
        <input className="form-input" placeholder="Buscar…" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 200 }} />
        <select className="library-filter-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          <option value="">Todos los niveles</option>
          <option value="basic">Básica</option>
          <option value="secondary">Media</option>
        </select>
        <select className="library-filter-select" value={bloomFilter} onChange={(e) => setBloomFilter(e.target.value)}>
          <option value="">Todos los procesos</option>
          <option value="RECORDAR">Recordar</option>
          <option value="COMPRENDER">Comprender</option>
          <option value="APLICAR">Aplicar</option>
          <option value="ANALIZAR">Analizar</option>
          <option value="EVALUAR">Evaluar</option>
          <option value="CREAR">Crear</option>
        </select>
        <select className="library-filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Todas las categorías</option>
          {PHYSICAL_EDUCATION_SKILLS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {categoryFilter === "physical_capacity" && (
          <select className="library-filter-select" value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)}>
            <option value="">Todas las capacidades</option>
            {PHYSICAL_CAPACITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        )}
        <select className="library-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="ready">Lista</option>
          <option value="archived">Archivada</option>
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", cursor: "pointer" }}>
          <input type="checkbox" checked={favoriteOnly} onChange={(e) => setFavoriteOnly(e.target.checked)} />
          Favoritas
        </label>
      </div>

      <p className="library-count">{filtered.length} habilidad{filtered.length !== 1 ? "es" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.map((item) => (
        <div key={item.id} className="skill-card">
          <div className="skill-card-text">{item.skillText}</div>
          <div className="skill-card-meta">
            <span className="skill-card-tag skill-card-tag-bloom">{item.bloomLevel}</span>
            <span className="skill-card-tag skill-card-tag-category">{item.verb}</span>
            {item.physicalCapacity && (
              <span className="skill-card-tag skill-card-tag-category">{PHYSICAL_CAPACITIES.find((c) => c.value === item.physicalCapacity)?.label}</span>
            )}
            <span>{item.grades.map((g) => GRADE_LABELS[g.grade] || g.grade).join(", ")}</span>
            {item.status === "draft" && <span className="skill-card-tag skill-card-tag-status">Borrador</span>}
            {item.isFavorite && <span className="skill-card-tag skill-card-tag-favorite">★</span>}
          </div>
          <div className="skill-card-actions">
            <button className="import-detail-btn" onClick={() => onViewSkill(item.id)}>Ver</button>
            <button className="import-detail-btn" onClick={() => onEditSkill(item.id)}>Editar</button>
            <button className="import-detail-btn" onClick={() => handleDuplicate(item.id)}>Duplicar</button>
            <button className="import-detail-btn" onClick={() => handleToggleFavorite(item.id)}>{item.isFavorite ? "★" : "☆"}</button>
            <button className="import-detail-btn" style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }} onClick={() => setConfirmDelete(item.id)}>Eliminar</button>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="search-empty"><p>No hay habilidades guardadas todavía.</p></div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Eliminar habilidad</h2>
            <p className="modal-text">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="modal-confirm-btn" onClick={() => handleDelete(confirmDelete!)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Volver</button>
    </div>
  );
}

export default SkillObjectiveLibraryPage;
