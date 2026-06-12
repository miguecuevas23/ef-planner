import { ImportActivity } from "../types/importTypes";

export function parseJsonFile(content: string): ImportActivity[] {
  const data = JSON.parse(content);

  if (Array.isArray(data)) {
    return data.map(normalizeKeys);
  }

  if (data && typeof data === "object" && Array.isArray(data.activities)) {
    return data.activities.map(normalizeKeys);
  }

  throw new Error("El JSON no tiene un formato reconocido. Usa un array de actividades o un objeto con clave 'activities'.");
}

export function parseTxtFile(content: string): ImportActivity[] {
  const activities: ImportActivity[] = [];
  const blocks = content.split(/\n-{3,}\n/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const activity = parseTxtBlock(trimmed);
    if (activity) {
      activities.push(activity);
    }
  }

  if (activities.length === 0) {
    throw new Error("No se encontraron actividades en el archivo TXT. Asegúrate de separar cada actividad con '---'.");
  }

  return activities;
}

function parseTxtBlock(block: string): ImportActivity | null {
  const activity: ImportActivity = {};
  const lines = block.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;

    const key = match[1].trim().toLowerCase();
    const value = match[2].trim();

    if (!value) continue;

    switch (key) {
      case "título":
      case "titulo":
      case "title":
        activity.title = value;
        break;
      case "descripción":
      case "descripcion":
      case "description":
        activity.description = value;
        break;
      case "objetivo":
      case "objective":
        activity.objective = value;
        break;
      case "momento":
      case "moment":
        activity.moment = value;
        break;
      case "capacidad":
      case "capacidad física":
      case "capacidad fisica":
      case "physicalcapacity":
        activity.physicalCapacity = value;
        break;
      case "intensidad":
      case "intensity":
        activity.intensity = value;
        break;
      case "espacio":
      case "space":
        activity.space = value;
        break;
      case "materiales":
      case "materials":
        activity.materials = value.split(/,\s*/).filter(Boolean);
        break;
      case "estudiantes mínimos":
      case "estudiantes minimos":
      case "minstudents":
        activity.minStudents = parseInt(value, 10);
        break;
      case "cursos":
      case "suggestedgrades":
        activity.suggestedGrades = value.split(/,\s*/).filter(Boolean);
        break;
    }
  }

  if (Object.keys(activity).length === 0) return null;
  return activity;
}

function normalizeKeys(item: Record<string, unknown>): ImportActivity {
  const activity: ImportActivity = {};

  for (const [key, value] of Object.entries(item)) {
    const k = key.toLowerCase().trim();

    switch (k) {
      case "title":
        activity.title = String(value ?? "");
        break;
      case "description":
        activity.description = String(value ?? "");
        break;
      case "objective":
        activity.objective = String(value ?? "");
        break;
      case "moment":
        activity.moment = String(value ?? "");
        break;
      case "physicalcapacity":
        activity.physicalCapacity = String(value ?? "");
        break;
      case "intensity":
        activity.intensity = String(value ?? "");
        break;
      case "space":
        activity.space = String(value ?? "");
        break;
      case "materials":
        if (Array.isArray(value)) {
          activity.materials = value.map((v) => String(v));
        }
        break;
      case "minstudents":
        activity.minStudents = Number(value) || undefined;
        break;
      case "suggestedgrades":
        if (Array.isArray(value)) {
          activity.suggestedGrades = value.map((v) => String(v));
        }
        break;
    }
  }

  return activity;
}
