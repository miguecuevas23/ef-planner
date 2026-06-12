import { Activity, ClassMoment, PhysicalCapacity, IntensityLevel, Space } from "../../activities/types/activity";
import { ImportActivity, ImportPreviewItem, ImportStatus } from "../types/importTypes";
import {
  CLASS_MOMENTS,
  PHYSICAL_CAPACITIES,
  INTENSITY_LEVELS,
  SPACES,
  SUGGESTED_GRADES,
} from "../../../shared/constants/pedagogicalOptions";

const VALID_MOMENTS = CLASS_MOMENTS.map((o) => o.value);
const VALID_CAPACITIES = PHYSICAL_CAPACITIES.map((o) => o.value);
const VALID_INTENSITIES = INTENSITY_LEVELS.map((o) => o.value);
const VALID_SPACES = SPACES.map((o) => o.value);
const VALID_GRADES = SUGGESTED_GRADES.map((o) => o.value);

export function normalizeActivity(
  raw: ImportActivity,
  index: number
): ImportPreviewItem {
  const warnings: string[] = [];
  const errors: string[] = [];

  const title = (raw.title ?? "").trim();
  const description = (raw.description ?? "").trim();
  const objective = (raw.objective ?? "").trim();

  if (!title) errors.push("Falta el título.");
  if (!description) errors.push("Falta la descripción.");
  if (!objective) errors.push("Falta el objetivo.");

  const moment = normalizeMoment(raw.moment, warnings);
  if (!moment) errors.push("Falta el momento de clase o el valor no es válido.");

  const physicalCapacity = normalizePhysicalCapacity(raw.physicalCapacity, warnings);
  if (!physicalCapacity) errors.push("Falta la capacidad física o el valor no es válido.");

  const intensity = normalizeIntensity(raw.intensity, warnings);
  const space = normalizeSpace(raw.space, warnings);
  const materials = Array.isArray(raw.materials) ? raw.materials.map((m) => String(m).trim()).filter(Boolean) : [];
  const minStudents = typeof raw.minStudents === "number" && raw.minStudents > 0 ? raw.minStudents : 2;
  const suggestedGrades = normalizeGrades(raw.suggestedGrades, warnings);

  if (!title) {
    return {
      index,
      raw,
      status: "error",
      warnings,
      errors,
      activity: null,
      isDuplicate: false,
      selected: false,
    };
  }

  const now = new Date().toISOString();
  const id = `import_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`;

  const activity: Activity = {
    id,
    name: title,
    description,
    classMoment: moment ?? "desarrollo",
    primaryObjective: objective,
    secondaryObjective: undefined,
    physicalCapacity: physicalCapacity ?? "coordinacion",
    minParticipants: minStudents,
    maxParticipants: 40,
    suggestedGrades,
    durationMinutes: 45,
    intensity: intensity ?? "media",
    space: space ?? "multicancha",
    equipment: materials,
    organization: "",
    variants: [],
    safetyNotes: "",
    observationCriteria: [],
    tags: [],
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  };

  let status: ImportStatus = "ok";
  if (errors.length > 0) {
    status = "error";
  } else if (warnings.length > 0) {
    status = "warning";
  }

  if (errors.length > 0) {
    return { index, raw, status: "error", warnings, errors, activity: null, isDuplicate: false, selected: false };
  }

  return { index, raw, status, warnings, errors, activity, isDuplicate: false, selected: true };
}

function normalizeMoment(value: string | undefined, warnings: string[]): ClassMoment | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();

  const aliasMap: Record<string, ClassMoment> = {
    calentamiento: "calentamiento",
    inicio: "calentamiento",
    desarrollo: "desarrollo",
    cierre: "cierre",
    final: "cierre",
  };

  const mapped = aliasMap[v];
  if (mapped) {
    if (mapped !== v) {
      warnings.push(`Momento "${value}" normalizado a "${mapped}".`);
    }
    return mapped;
  }

  if (VALID_MOMENTS.includes(v as ClassMoment)) {
    return v as ClassMoment;
  }

  warnings.push(`Momento "${value}" no reconocido. Se usará "desarrollo" por defecto.`);
  return "desarrollo";
}

function normalizePhysicalCapacity(value: string | undefined, warnings: string[]): PhysicalCapacity | null {
  if (!value) return null;
  const v = value.trim().toLowerCase()
    .replace(/ó/g, "o")
    .replace(/ción/g, "cion")
    .replace(/í/g, "i");

  const aliasMap: Record<string, PhysicalCapacity> = {
    resistencia: "resistencia",
    fuerza: "fuerza",
    velocidad: "velocidad",
    flexibilidad: "flexibilidad",
    coordinacion: "coordinacion",
    equilibrio: "equilibrio",
    agilidad: "agilidad",
    reaccion: "reaccion",
  };

  const mapped = aliasMap[v];
  if (mapped) {
    if (mapped !== v) {
      warnings.push(`Capacidad "${value}" normalizada a "${mapped}".`);
    }
    return mapped;
  }

  if (VALID_CAPACITIES.includes(v as PhysicalCapacity)) {
    return v as PhysicalCapacity;
  }

  warnings.push(`Capacidad "${value}" no reconocida.`);
  return null;
}

function normalizeIntensity(value: string | undefined, warnings: string[]): IntensityLevel | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();

  if (VALID_INTENSITIES.includes(v as IntensityLevel)) {
    return v as IntensityLevel;
  }

  warnings.push(`Intensidad "${value}" no reconocida. Se usará "media".`);
  return "media";
}

function normalizeSpace(value: string | undefined, warnings: string[]): Space | null {
  if (!value) return null;
  const v = value.trim().toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/ñ/g, "n");

  const aliasMap: Record<string, Space> = {
    sala: "sala",
    patio_pequeno: "patio_pequeno",
    patio: "patio_pequeno",
    cancha: "multicancha",
    multicancha: "multicancha",
    gimnasio: "gimnasio",
    cancha_grande: "cancha_grande",
  };

  const mapped = aliasMap[v];
  if (mapped) {
    if (mapped !== v) {
      warnings.push(`Espacio "${value}" normalizado a "${mapped}".`);
    }
    return mapped;
  }

  if (VALID_SPACES.includes(v as Space)) {
    return v as Space;
  }

  warnings.push(`Espacio "${value}" no reconocido. Se usará "multicancha".`);
  return "multicancha";
}

function normalizeGrades(grades: string[] | undefined, warnings: string[]): string[] {
  if (!grades || !Array.isArray(grades)) return [];

  return grades
    .map((g) => String(g).trim())
    .filter(Boolean)
    .map((g) => {
      const normalized = g
        .replace(/basico/gi, "")
        .replace(/básico/gi, "")
        .replace(/medio/gi, "")
        .replace(/^\s+|\s+$/g, "")
        .trim();

      if (VALID_GRADES.includes(normalized)) {
        return normalized;
      }

      if (VALID_GRADES.includes(g)) {
        return g;
      }

      warnings.push(`Curso "${g}" no reconocido en las opciones disponibles.`);
      return g;
    });
}

export function detectDuplicates(items: ImportPreviewItem[], existingActivities: Activity[]): void {
  const existingNames = new Set(existingActivities.map((a) => a.name.toLowerCase().trim()));

  for (const item of items) {
    if (!item.activity) continue;
    const name = item.activity.name.toLowerCase().trim();
    if (existingNames.has(name)) {
      item.isDuplicate = true;
      item.status = "duplicate";
      item.warnings.push("Posible duplicado: ya existe una actividad con el mismo título.");
    }
  }
}
