import { useState, useEffect } from "react";
import { Activity, ClassMoment, PhysicalCapacity, IntensityLevel, Space } from "../types/activity";
import { CLASS_MOMENTS, PHYSICAL_CAPACITIES, INTENSITY_LEVELS, SPACES, SUGGESTED_GRADES } from "../../../shared/constants/pedagogicalOptions";
import { createActivity, updateActivity } from "../services/activityRepository";
import "./ActivityFormPage.css";

interface PageProps {
  onBack: () => void;
  activityToEdit?: Activity;
  onSaved?: () => void;
}

interface FieldErrors {
  name?: string;
  primaryObjective?: string;
  description?: string;
  minParticipants?: string;
  maxParticipants?: string;
  durationMinutes?: string;
  classMoment?: string;
  physicalCapacity?: string;
  intensity?: string;
  space?: string;
}

function parseCommaList(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ActivityFormPage({ onBack, activityToEdit, onSaved }: PageProps) {
  const isEditing = !!activityToEdit;

  const [name, setName] = useState("");
  const [classMoment, setClassMoment] = useState<ClassMoment | "">("");
  const [primaryObjective, setPrimaryObjective] = useState("");
  const [secondaryObjective, setSecondaryObjective] = useState("");
  const [physicalCapacity, setPhysicalCapacity] = useState<PhysicalCapacity | "">("");
  const [minParticipants, setMinParticipants] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [suggestedGrades, setSuggestedGrades] = useState<string[]>([]);
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [intensity, setIntensity] = useState<IntensityLevel | "">("");
  const [space, setSpace] = useState<Space | "">("");
  const [equipment, setEquipment] = useState("");
  const [description, setDescription] = useState("");
  const [organization, setOrganization] = useState("");
  const [variants, setVariants] = useState("");
  const [safetyNotes, setSafetyNotes] = useState("");
  const [observationCriteria, setObservationCriteria] = useState("");
  const [tags, setTags] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!activityToEdit) return;
    setName(activityToEdit.name);
    setClassMoment(activityToEdit.classMoment);
    setPrimaryObjective(activityToEdit.primaryObjective);
    setSecondaryObjective(activityToEdit.secondaryObjective ?? "");
    setPhysicalCapacity(activityToEdit.physicalCapacity);
    setMinParticipants(String(activityToEdit.minParticipants));
    setMaxParticipants(String(activityToEdit.maxParticipants));
    setSuggestedGrades(activityToEdit.suggestedGrades);
    setDurationMinutes(String(activityToEdit.durationMinutes));
    setIntensity(activityToEdit.intensity);
    setSpace(activityToEdit.space);
    setEquipment(activityToEdit.equipment.join(", "));
    setDescription(activityToEdit.description);
    setOrganization(activityToEdit.organization);
    setVariants(activityToEdit.variants.join(", "));
    setSafetyNotes(activityToEdit.safetyNotes);
    setObservationCriteria(activityToEdit.observationCriteria.join(", "));
    setTags(activityToEdit.tags.join(", "));
  }, [activityToEdit]);

  const allGradesSelected = suggestedGrades.length === SUGGESTED_GRADES.length;

  function handleToggleAllGrades() {
    if (allGradesSelected) {
      setSuggestedGrades([]);
    } else {
      setSuggestedGrades(SUGGESTED_GRADES.map((g) => g.value));
    }
  }

  function handleToggleGrade(value: string) {
    setSuggestedGrades((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!name.trim()) e.name = "El nombre es obligatorio.";
    if (!classMoment) e.classMoment = "Selecciona un momento de la clase.";
    if (!primaryObjective.trim()) e.primaryObjective = "El objetivo principal es obligatorio.";
    if (!physicalCapacity) e.physicalCapacity = "Selecciona una capacidad física.";
    if (!intensity) e.intensity = "Selecciona la intensidad.";
    if (!space) e.space = "Selecciona el espacio.";
    if (!description.trim()) e.description = "La descripción es obligatoria.";

    const min = Number(minParticipants);
    const max = Number(maxParticipants);
    const dur = Number(durationMinutes);

    if (!minParticipants || min <= 0) e.minParticipants = "Mínimo debe ser mayor a 0.";
    if (!maxParticipants || max <= 0) {
      e.maxParticipants = "Máximo debe ser mayor a 0.";
    } else if (max < min) {
      e.maxParticipants = "Máximo debe ser >= mínimo.";
    }
    if (!durationMinutes || dur <= 0) e.durationMinutes = "Duración debe ser mayor a 0.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage("");
    if (!validate()) return;

    const now = new Date().toISOString();
    const activity: Activity = {
      id: activityToEdit ? activityToEdit.id : crypto.randomUUID(),
      name: name.trim(),
      classMoment: classMoment as ClassMoment,
      primaryObjective: primaryObjective.trim(),
      secondaryObjective: secondaryObjective.trim() || undefined,
      physicalCapacity: physicalCapacity as PhysicalCapacity,
      minParticipants: Number(minParticipants),
      maxParticipants: Number(maxParticipants),
      suggestedGrades,
      durationMinutes: Number(durationMinutes),
      intensity: intensity as IntensityLevel,
      space: space as Space,
      equipment: parseCommaList(equipment),
      description: description.trim(),
      organization: organization.trim(),
      variants: parseCommaList(variants),
      safetyNotes: safetyNotes.trim(),
      observationCriteria: parseCommaList(observationCriteria),
      tags: parseCommaList(tags),
      isFavorite: activityToEdit ? activityToEdit.isFavorite : false,
      createdAt: activityToEdit ? activityToEdit.createdAt : now,
      updatedAt: now,
    };

    try {
      if (isEditing) {
        await updateActivity(activity);
      } else {
        await createActivity(activity);
      }
      setSuccessMessage(isEditing ? "Actividad modificada correctamente." : "Actividad guardada correctamente.");
      if (onSaved) setTimeout(() => onSaved(), 800);
    } catch (error) {
      console.error("[Form] No se pudo guardar la actividad:", error);
      alert("No se pudo guardar la actividad. Revisa la consola.");
    }
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <button className="back-btn" onClick={onBack}>
          ← {isEditing ? "Cancelar edición" : "Volver"}
        </button>
        <h1 className="form-page-title">{isEditing ? "Editar actividad" : "Nueva actividad"}</h1>
        <p className="form-page-subtitle">
          {isEditing ? "Modifica los campos de la actividad" : "Completa los campos para crear una actividad pedagógica"}
        </p>
      </div>

      <form className="activity-form" onSubmit={handleSubmit}>
        {successMessage && (
          <div className="form-success">{successMessage}</div>
        )}

        <div className="form-section">
          <h2 className="form-section-title">Información general</h2>

          <div className="form-field">
            <label className="form-label">Nombre de la actividad *</label>
            <input type="text" className="form-input" placeholder="Ej: Carrera de relevos" value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Momento de la clase *</label>
              <select className="form-input" value={classMoment} onChange={(e) => setClassMoment(e.target.value as ClassMoment)}>
                <option value="">Seleccionar</option>
                {CLASS_MOMENTS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              {errors.classMoment && <span className="form-error">{errors.classMoment}</span>}
            </div>

            <div className="form-field">
              <label className="form-label">Capacidad física *</label>
              <select className="form-input" value={physicalCapacity} onChange={(e) => setPhysicalCapacity(e.target.value as PhysicalCapacity)}>
                <option value="">Seleccionar</option>
                {PHYSICAL_CAPACITIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.physicalCapacity && <span className="form-error">{errors.physicalCapacity}</span>}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Objetivo principal *</label>
            <textarea className="form-input form-textarea" placeholder="Describe el objetivo pedagógico..." rows={2} value={primaryObjective} onChange={(e) => setPrimaryObjective(e.target.value)} />
            {errors.primaryObjective && <span className="form-error">{errors.primaryObjective}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Objetivo secundario (opcional)</label>
            <textarea className="form-input form-textarea" placeholder="Objetivo complementario..." rows={2} value={secondaryObjective} onChange={(e) => setSecondaryObjective(e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Cursos sugeridos</label>
            <button type="button" className="form-select-all-btn" onClick={handleToggleAllGrades}>
              {allGradesSelected ? "Deseleccionar todos" : "Seleccionar todos los cursos"}
            </button>
            <div className="form-checkbox-group">
              {SUGGESTED_GRADES.map((g) => (
                <label key={g.value} className="form-checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={suggestedGrades.includes(g.value)}
                    onChange={() => handleToggleGrade(g.value)}
                  />{" "}
                  {g.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Parámetros de ejecución</h2>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Participantes mínimos *</label>
              <input type="number" className="form-input" min={1} placeholder="2" value={minParticipants} onChange={(e) => setMinParticipants(e.target.value)} />
              {errors.minParticipants && <span className="form-error">{errors.minParticipants}</span>}
            </div>

            <div className="form-field">
              <label className="form-label">Participantes máximos *</label>
              <input type="number" className="form-input" min={1} placeholder="40" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
              {errors.maxParticipants && <span className="form-error">{errors.maxParticipants}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Duración (minutos) *</label>
              <input type="number" className="form-input" min={1} placeholder="15" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
              {errors.durationMinutes && <span className="form-error">{errors.durationMinutes}</span>}
            </div>

            <div className="form-field">
              <label className="form-label">Intensidad *</label>
              <select className="form-input" value={intensity} onChange={(e) => setIntensity(e.target.value as IntensityLevel)}>
                <option value="">Seleccionar</option>
                {INTENSITY_LEVELS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
              {errors.intensity && <span className="form-error">{errors.intensity}</span>}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Espacio *</label>
            <select className="form-input" value={space} onChange={(e) => setSpace(e.target.value as Space)}>
              <option value="">Seleccionar</option>
              {SPACES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {errors.space && <span className="form-error">{errors.space}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Implementos (separados por coma)</label>
            <input type="text" className="form-input" placeholder="Ej: conos, balones, silbato" value={equipment} onChange={(e) => setEquipment(e.target.value)} />
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Contenido pedagógico</h2>

          <div className="form-field">
            <label className="form-label">Descripción *</label>
            <textarea className="form-input form-textarea" placeholder="Describe la actividad en detalle..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Organización</label>
            <textarea className="form-input form-textarea" placeholder="Cómo se organizan los estudiantes..." rows={2} value={organization} onChange={(e) => setOrganization(e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Variantes (separadas por coma)</label>
            <textarea className="form-input form-textarea" placeholder="Una variante por coma..." rows={2} value={variants} onChange={(e) => setVariants(e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Notas de seguridad</label>
            <textarea className="form-input form-textarea" placeholder="Precauciones y medidas de seguridad..." rows={2} value={safetyNotes} onChange={(e) => setSafetyNotes(e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Criterios de observación (separados por coma)</label>
            <textarea className="form-input form-textarea" placeholder="Un criterio por coma..." rows={2} value={observationCriteria} onChange={(e) => setObservationCriteria(e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Etiquetas (separadas por coma)</label>
            <input type="text" className="form-input" placeholder="Ej: circuito, resistencia, estaciones" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
        </div>

        <button type="submit" className="form-submit-btn">
          {isEditing ? "Guardar cambios" : "Guardar actividad"}
        </button>
      </form>

      <button className="back-btn" onClick={onBack}>
        ← {isEditing ? "Cancelar edición" : "Volver"}
      </button>
    </div>
  );
}

export default ActivityFormPage;
