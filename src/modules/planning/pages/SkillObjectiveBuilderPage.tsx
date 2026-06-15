import { useState, useEffect } from "react";
import HomeButton from "../../../shared/components/HomeButton";
import {
  SkillObjectiveStatus, SkillCategory, PhysicalCapacity,
  SkillObjectiveDraft,
} from "../types/skillObjective";
import {
  getBloomLevels, getBloomLevelData, getPrimaryVerbs,
} from "../services/bloomTaxonomyService";
import { createSkillObjective, updateSkillObjective, getSkillObjectiveById } from "../services/skillObjectiveRepository";
import {
  PHYSICAL_EDUCATION_SKILLS, PHYSICAL_CAPACITIES, CONTEXT_SUGGESTIONS,
  SUGGESTED_GRADES_BASIC, SUGGESTED_GRADES_SECONDARY, GRADE_LABELS,
} from "../constants/physicalEducationSkills";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./PlanningComingSoonPage.css";

interface PageProps {
  onBack: () => void;
  editId?: string | null;
}

function composeText(draft: SkillObjectiveDraft): string {
  const parts: string[] = [];
  if (draft.verb) parts.push(draft.verb);
  if (draft.skillDetail) parts.push(draft.skillDetail);
  if (draft.contextCondition) parts.push(draft.contextCondition);
  let text = parts.join(" ").replace(/\s+/g, " ").trim();
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!text.endsWith(".")) text += ".";
  }
  return text;
}

const emptyDraft: SkillObjectiveDraft = {
  educationLevel: null,
  grades: [],
  primaryGrade: null,
  bloomLevel: null,
  verb: "",
  skillCategory: null,
  skillDetail: "",
  contextCondition: "",
  customFinalText: "",
  notes: "",
  status: "draft",
  physicalCapacity: null,
};

function SkillObjectiveBuilderPage({ onBack, editId }: PageProps) {
  const [draft, setDraft] = useState<SkillObjectiveDraft>(emptyDraft);
  const [customVerb, setCustomVerb] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const isEditing = !!editId;

  useEffect(() => {
    if (editId) {
      getSkillObjectiveById(editId).then((obj) => {
        if (obj) {
          setDraft({
            educationLevel: obj.educationLevel,
            grades: obj.grades.map((g) => g.grade),
            primaryGrade: obj.grades.find((g) => g.isPrimary)?.grade ?? null,
            bloomLevel: obj.bloomLevel,
            verb: obj.verb,
            skillCategory: obj.skillCategory,
            skillDetail: obj.skillDetail,
            contextCondition: obj.contextCondition ?? "",
            customFinalText: obj.customFinalText ?? "",
            notes: obj.notes ?? "",
            status: obj.status,
            physicalCapacity: obj.physicalCapacity ?? null,
          });
        }
      });
    }
  }, [editId]);

  function set<K extends keyof SkillObjectiveDraft>(key: K, value: SkillObjectiveDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function toggleGrade(grade: string) {
    setDraft((prev) => {
      const exists = prev.grades.includes(grade);
      const next = exists ? prev.grades.filter((g) => g !== grade) : [...prev.grades, grade];
      const primary = next.includes(prev.primaryGrade ?? "") ? prev.primaryGrade : next[0] ?? null;
      return { ...prev, grades: next, primaryGrade: primary };
    });
  }

  function validate(): boolean {
    if (!draft.educationLevel) { setError("Selecciona el nivel educativo."); return false; }
    if (draft.grades.length === 0) { setError("Selecciona al menos un curso."); return false; }
    if (!draft.bloomLevel) { setError("Selecciona un proceso cognitivo."); return false; }
    if (!draft.verb) { setError("Selecciona o escribe un verbo."); return false; }
    if (!draft.skillCategory) { setError("Selecciona una categoría de habilidad."); return false; }
    if (draft.skillCategory === "physical_capacity" && !draft.physicalCapacity) { setError("Selecciona una capacidad física."); return false; }
    if (!draft.skillDetail.trim()) { setError("Describe el patrón, la habilidad o la capacidad."); return false; }
    const text = draft.customFinalText?.trim() || composeText(draft);
    if (!text) { setError("El texto de la habilidad no puede estar vacío."); return false; }
    setError("");
    return true;
  }

  async function handleSave(status: SkillObjectiveStatus) {
    if (!validate()) return;
    const toSave = { ...draft, status };
    try {
      if (isEditing) {
        await updateSkillObjective(editId!, toSave);
      } else {
        await createSkillObjective(toSave);
      }
      setSaved(true);
    } catch (e) {
      setError("Error al guardar. Intenta nuevamente.");
      console.error(e);
    }
  }

  if (saved) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <h1 className="search-page-title">Habilidad guardada</h1>
          <p className="search-page-subtitle">El componente de habilidad se guardó correctamente.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="builder-save-btn" onClick={() => { setDraft(emptyDraft); setSaved(false); }}>Crear otra</button>
          <button className="builder-outline-btn" onClick={onBack}>Volver</button>
        </div>
      </div>
    );
  }

  const grades = draft.educationLevel === "basic" ? SUGGESTED_GRADES_BASIC : SUGGESTED_GRADES_SECONDARY;
  const previewText = draft.customFinalText?.trim() || composeText(draft);
  const selectedBloomData = draft.bloomLevel ? getBloomLevelData(draft.bloomLevel) : null;
  const selectedCategory = PHYSICAL_EDUCATION_SKILLS.find((c) => c.value === draft.skillCategory);

  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Cancelar</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">{isEditing ? "Editar habilidad" : "Crear habilidad"}</h1>
        <p className="search-page-subtitle">Componente de Objetivo de Aprendizaje</p>
      </div>

      {error && <div className="import-error-msg">{error}</div>}

      <div className="builder-steps">
        {/* Step 1: Education Level */}
        <div className="builder-step-card">
          <div className="builder-step-title">1. Nivel educativo</div>
          <div className="builder-options-grid">
            <button className={`builder-option-btn ${draft.educationLevel === "basic" ? "builder-selected" : ""}`} onClick={() => { set("educationLevel", "basic"); set("grades", []); set("primaryGrade", null); }}>Educación Básica</button>
            <button className={`builder-option-btn ${draft.educationLevel === "secondary" ? "builder-selected" : ""}`} onClick={() => { set("educationLevel", "secondary"); set("grades", []); set("primaryGrade", null); }}>Educación Media</button>
          </div>
        </div>

        {/* Step 2: Grades */}
        {draft.educationLevel && (
          <div className="builder-step-card">
            <div className="builder-step-title">2. Cursos</div>
            <div className="builder-check-grid">
              {grades.map((g) => (
                <label key={g} className="builder-check-label">
                  <input type="checkbox" checked={draft.grades.includes(g)} onChange={() => toggleGrade(g)} />
                  {GRADE_LABELS[g] || g}
                </label>
              ))}
            </div>
            {draft.grades.length > 1 && (
              <div style={{ marginTop: "0.75rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>Curso principal: </span>
                <select className="library-filter-select" value={draft.primaryGrade ?? ""} onChange={(e) => set("primaryGrade", e.target.value)}>
                  {draft.grades.map((g) => (
                    <option key={g} value={g}>{GRADE_LABELS[g] || g}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Bloom Level */}
        <div className="builder-step-card">
          <div className="builder-step-title">3. Proceso cognitivo</div>
          <div className="builder-bloom-grid">
            {getBloomLevels().map((level) => {
              const data = getBloomLevelData(level);
              return (
                <button key={level} className={`builder-bloom-card ${draft.bloomLevel === level ? "builder-selected" : ""}`} onClick={() => set("bloomLevel", level)}>
                  <div className="builder-bloom-name">{level.charAt(0) + level.slice(1).toLowerCase()}</div>
                  <span className={`builder-bloom-order ${data.order === "lower" ? "builder-order-lower" : "builder-order-higher"}`}>
                    {data.order === "lower" ? "Orden inferior" : "Orden superior"}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedBloomData && (
            <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "0.5rem" }}>{selectedBloomData.description}</p>
          )}
        </div>

        {/* Step 4: Verb */}
        {draft.bloomLevel && selectedBloomData && (
          <div className="builder-step-card">
            <div className="builder-step-title">4. Verbo</div>
            <div className="builder-verb-grid">
              {getPrimaryVerbs(draft.bloomLevel).map((verb) => (
                <button key={verb} className={`builder-verb-btn ${draft.verb === verb ? "builder-selected" : ""}`} onClick={() => set("verb", verb)}>{verb}</button>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <input className="form-input" placeholder="O escribe un verbo personalizado…" value={customVerb} onChange={(e) => { setCustomVerb(e.target.value); if (e.target.value) set("verb", e.target.value); }} style={{ maxWidth: 300 }} />
            </div>
          </div>
        )}

        {/* Step 5: Category */}
        <div className="builder-step-card">
          <div className="builder-step-title">5. Categoría de habilidad</div>
          <div className="builder-options-grid">
            {PHYSICAL_EDUCATION_SKILLS.map((cat) => (
              <button key={cat.value} className={`builder-option-btn ${draft.skillCategory === cat.value ? "builder-selected" : ""}`} onClick={() => set("skillCategory", cat.value as SkillCategory)} style={{ fontSize: "0.82rem" }}>
                {cat.label}
              </button>
            ))}
          </div>
          {selectedCategory && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "var(--color-bg)", borderRadius: 8, fontSize: "0.8rem", color: "var(--color-muted)", lineHeight: 1.5 }}>
              {selectedCategory.description}
              {selectedCategory.value !== "physical_capacity" && (
                <>
                  <div style={{ marginTop: "0.5rem", fontWeight: 600, color: "var(--color-text)" }}>Ejemplos:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.3rem" }}>
                    {selectedCategory.examples.map((ex) => (
                      <span key={ex} style={{ fontSize: "0.75rem", background: "var(--color-surface)", padding: "0.15rem 0.5rem", borderRadius: 4, border: "1px solid var(--color-border)" }}>{ex}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {draft.skillCategory === "physical_capacity" && (
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.5rem" }}>Selecciona una capacidad:</div>
              <div className="builder-verb-grid">
                {PHYSICAL_CAPACITIES.map((cap) => (
                  <button key={cap.value} className={`builder-verb-btn ${draft.physicalCapacity === cap.value ? "builder-selected" : ""}`} onClick={() => set("physicalCapacity", cap.value as PhysicalCapacity)}>
                    {cap.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 6: Pattern, Skill or Capacity */}
        <div className="builder-step-card">
          <div className="builder-step-title">6. ¿Qué patrón, habilidad o capacidad se trabajará?</div>
          <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginBottom: "0.5rem" }}>Describe concretamente el patrón motor, la habilidad o la capacidad física que desarrollarán los estudiantes.</p>
          {selectedCategory && selectedCategory.value !== "physical_capacity" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem" }}>
              {selectedCategory.examples.map((ex) => (
                <button key={ex} className="builder-verb-btn" style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }} onClick={() => set("skillDetail", (draft.skillDetail ? draft.skillDetail + " - " : "") + ex)}>{ex}</button>
              ))}
            </div>
          )}
          {draft.physicalCapacity && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem" }}>
              {PHYSICAL_CAPACITIES.find((c) => c.value === draft.physicalCapacity)?.examples.map((ex) => (
                <button key={ex} className="builder-verb-btn" style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }} onClick={() => set("skillDetail", ex)}>{ex}</button>
              ))}
            </div>
          )}
          <textarea className="form-input form-textarea" rows={2} placeholder={selectedCategory ? "Describe el patrón, la habilidad o la capacidad específica…" : "Selecciona primero una categoría"} value={draft.skillDetail} onChange={(e) => set("skillDetail", e.target.value)} />
        </div>

        {/* Step 7: Context */}
        <div className="builder-step-card">
          <div className="builder-step-title">7. Contexto</div>
          <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginBottom: "0.5rem" }}>¿Mediante qué tipo de situación se trabajará?</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem" }}>
            {CONTEXT_SUGGESTIONS.map((s) => (
              <button key={s} className="builder-verb-btn" style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }} onClick={() => set("contextCondition", s)}>{s}</button>
            ))}
          </div>
          <input className="form-input" placeholder="Escribe el contexto o usa una sugerencia…" value={draft.contextCondition} onChange={(e) => set("contextCondition", e.target.value)} />
        </div>

        {/* Step 8: Preview */}
        <div className="builder-step-card">
          <div className="builder-step-title">8. Vista previa</div>
          <div className="builder-preview-box">{previewText || "Completa los campos anteriores para ver la vista previa."}</div>
          <p className="builder-preview-note">Este texto corresponde únicamente al componente de habilidad. Los conocimientos y actitudes se incorporarán posteriormente para construir un Objetivo de Aprendizaje completo.</p>
        </div>

        {/* Step 9: Final edit */}
        <div className="builder-step-card">
          <div className="builder-step-title">9. Edición final (opcional)</div>
          <textarea className="form-input form-textarea" rows={3} placeholder="Edita manualmente el texto si lo deseas…" value={draft.customFinalText} onChange={(e) => set("customFinalText", e.target.value)} />
          <div style={{ marginTop: "0.5rem" }}>
            <button className="builder-outline-btn" onClick={() => set("customFinalText", "")} style={{ fontSize: "0.8rem" }}>Restaurar versión generada</button>
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <label className="form-label">Notas (opcional)</label>
            <textarea className="form-input form-textarea" rows={2} value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>

        {/* Actions */}
        <div className="builder-actions" style={{ justifyContent: "center", paddingBottom: "2rem" }}>
          <button className="builder-outline-btn" onClick={() => handleSave("draft")}>Guardar borrador</button>
          <button className="builder-save-btn" onClick={() => handleSave("ready")}>Guardar como lista</button>
          <button className="builder-outline-btn" onClick={onBack}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default SkillObjectiveBuilderPage;
