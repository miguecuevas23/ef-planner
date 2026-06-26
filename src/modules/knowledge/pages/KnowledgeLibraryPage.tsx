import { useState, useEffect, useCallback } from "react";
import HomeButton from "../../../shared/components/HomeButton";
import { KnowledgeItem, SUGGESTED_GRADES } from "../types/knowledge";
import { getAllKnowledgeItems, toggleKnowledgeFavorite, deleteKnowledgeItem, duplicateKnowledgeItem, getAllCategories } from "../services/knowledgeRepository";
import "../../activities/pages/ActivitiesSearchPage.css";

interface PageProps {
  onBack: () => void;
  onEdit: (id: number) => void;
  onNew: () => void;
}

function KnowledgeLibraryPage({ onBack, onEdit, onNew }: PageProps) {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllKnowledgeItems();
      setItems(all);
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (e) {
      console.error("[Knowledge] Load failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleToggleFavorite(id: number) {
    await toggleKnowledgeFavorite(id);
    load();
  }

  async function handleDelete(id: number) {
    await deleteKnowledgeItem(id);
    setConfirmDelete(null);
    load();
  }

  async function handleDuplicate(id: number) {
    await duplicateKnowledgeItem(id);
    load();
  }

  const filtered = items.filter((item) => {
    if (filter && !item.title.toLowerCase().includes(filter.toLowerCase()) && !item.description.toLowerCase().includes(filter.toLowerCase())) return false;
    if (levelFilter && item.educationalLevel !== levelFilter) return false;
    if (courseFilter && item.course !== courseFilter) return false;
    if (categoryFilter && item.categoryId?.toString() !== categoryFilter) return false;
    if (favoriteOnly && !item.isFavorite) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <button className="back-btn" onClick={onBack}>← Volver</button>
          <HomeButton onClick={onBack} />
          <h1 className="search-page-title">Biblioteca de Conocimientos</h1>
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
        <h1 className="search-page-title">Biblioteca de Conocimientos</h1>
        <p className="search-page-subtitle">Saberes conceptuales para construir Objetivos de Aprendizaje</p>
      </div>

      <div className="library-filters">
        <input className="form-input" placeholder="Buscar…" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 200 }} />
        <select className="library-filter-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          <option value="">Todos los niveles</option>
          <option value="basic">Básica</option>
          <option value="secondary">Media</option>
        </select>
        <select className="library-filter-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          <option value="">Todos los cursos</option>
          {SUGGESTED_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="library-filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Todas las áreas</option>
          {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", cursor: "pointer" }}>
          <input type="checkbox" checked={favoriteOnly} onChange={(e) => setFavoriteOnly(e.target.checked)} />
          Favoritos
        </label>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <p className="library-count">{filtered.length} conocimiento{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
        <button className="import-btn-sm" onClick={onNew}>+ Nuevo</button>
      </div>

      {filtered.map((item) => (
        <div key={item.id} className="skill-card">
          <div className="skill-card-text">{item.title}</div>
          <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", lineHeight: 1.4, margin: "0.3rem 0" }}>
            {item.description.length > 120 ? item.description.slice(0, 120) + "…" : item.description}
          </p>
          <div className="skill-card-meta">
            <span className="skill-card-tag skill-card-tag-bloom">{item.course}</span>
            {item.categoryName && <span className="skill-card-tag skill-card-tag-category">{item.categoryName}</span>}
            {item.isFavorite && <span className="skill-card-tag skill-card-tag-favorite">★</span>}
          </div>
          <div className="skill-card-actions">
            <button className="import-detail-btn" onClick={() => onEdit(item.id)}>Editar</button>
            <button className="import-detail-btn" onClick={() => handleDuplicate(item.id)}>Duplicar</button>
            <button className="import-detail-btn" onClick={() => handleToggleFavorite(item.id)}>{item.isFavorite ? "★" : "☆"}</button>
            <button className="import-detail-btn" style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }} onClick={() => setConfirmDelete(item.id)}>Eliminar</button>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="search-empty"><p>No hay conocimientos guardados todavía.</p></div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Eliminar conocimiento</h2>
            <p className="modal-text">¿Deseas eliminar este conocimiento? Esta acción no se puede deshacer.</p>
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

export default KnowledgeLibraryPage;
