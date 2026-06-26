import { useState, useEffect } from "react";
import HomeButton from "../../../shared/components/HomeButton";
import { KnowledgeItemDraft, SUGGESTED_GRADES } from "../types/knowledge";
import { createKnowledgeItem, updateKnowledgeItem, getKnowledgeItemById, getAllCategories, createCategory } from "../services/knowledgeRepository";
import "../../activities/pages/ActivitiesSearchPage.css";

interface PageProps {
  onBack: () => void;
  editId?: number | null;
}

const emptyDraft: KnowledgeItemDraft = {
  title: "",
  description: "",
  educationalLevel: "basic",
  course: "5° Básico",
  categoryId: null,
  source: "Bases Curriculares Educación Física Chile",
  notes: "",
};

function KnowledgeFormPage({ onBack, editId }: PageProps) {
  const [draft, setDraft] = useState<KnowledgeItemDraft>(emptyDraft);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEditing = !!editId;

  useEffect(() => {
    getAllCategories().then(setCategories);
    if (editId) {
      getKnowledgeItemById(editId).then((item) => {
        if (item) {
          setDraft({
            title: item.title,
            description: item.description,
            educationalLevel: item.educationalLevel,
            course: item.course,
            categoryId: item.categoryId,
            source: item.source ?? "Bases Curriculares Educación Física Chile",
            notes: item.notes ?? "",
          });
        }
      });
    }
  }, [editId]);

  function set<K extends keyof KnowledgeItemDraft>(key: K, value: KnowledgeItemDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    if (!draft.title.trim()) { setError("El título es obligatorio."); return false; }
    if (!draft.description.trim()) { setError("La descripción es obligatoria."); return false; }
    if (!draft.course) { setError("Selecciona un curso."); return false; }
    if (!draft.categoryId && !newCategory.trim()) { setError("Selecciona o crea un área."); return false; }
    setError("");
    return true;
  }

  async function handleSave() {
    if (!validate()) return;
    try {
      let categoryId = draft.categoryId;
      if (newCategory.trim()) {
        const cat = await createCategory(newCategory.trim());
        categoryId = cat.id;
        categories.find((c) => c.name === newCategory.trim()) || setCategories([...categories, cat]);
        setNewCategory("");
      }
      const toSave = { ...draft, categoryId };

      if (isEditing) {
        await updateKnowledgeItem(editId!, toSave);
        setSuccess("Conocimiento actualizado correctamente.");
      } else {
        await createKnowledgeItem(toSave);
        setSuccess("Conocimiento creado correctamente.");
        setDraft(emptyDraft);
      }
    } catch (e) {
      setError("Error al guardar. Intenta nuevamente.");
      console.error(e);
    }
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Cancelar</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">{isEditing ? "Editar conocimiento" : "Nuevo conocimiento"}</h1>
        <p className="search-page-subtitle">Saber conceptual para Objetivos de Aprendizaje</p>
      </div>

      {error && <div className="import-error-msg">{error}</div>}
      {success && <div className="form-success" style={{ marginBottom: "1rem" }}>{success}</div>}

      <div className="form-section">
        <div className="form-field">
          <label className="form-label">Título *</label>
          <input className="form-input" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="ej.: Beneficios de la actividad física" />
        </div>

        <div className="form-field">
          <label className="form-label">Descripción *</label>
          <textarea className="form-input form-textarea" rows={4} value={draft.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe el conocimiento conceptual…" />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Nivel educativo</label>
            <select className="form-input" value={draft.educationalLevel} onChange={(e) => set("educationalLevel", e.target.value as KnowledgeItemDraft["educationalLevel"])}>
              <option value="basic">Educación Básica</option>
              <option value="secondary">Educación Media</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Curso *</label>
            <select className="form-input" value={draft.course} onChange={(e) => set("course", e.target.value)}>
              {SUGGESTED_GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Área *</label>
          <select className="form-input" value={draft.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value ? Number(e.target.value) : null)}>
            <option value="">Seleccionar área</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div style={{ marginTop: "0.5rem" }}>
            <input className="form-input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="O crea una nueva área…" style={{ maxWidth: 300 }} />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Fuente curricular</label>
          <input className="form-input" value={draft.source} onChange={(e) => set("source", e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Observaciones</label>
          <textarea className="form-input form-textarea" rows={2} value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>
      </div>

      <div className="builder-actions" style={{ justifyContent: "center", marginTop: "1rem", paddingBottom: "2rem" }}>
        <button className="builder-outline-btn" onClick={onBack}>Cancelar</button>
        <button className="builder-save-btn" onClick={handleSave}>{isEditing ? "Guardar cambios" : "Guardar"}</button>
        {!isEditing && <button className="builder-outline-btn" onClick={async () => { await handleSave(); }}>Guardar y crear otro</button>}
      </div>
    </div>
  );
}

export default KnowledgeFormPage;
