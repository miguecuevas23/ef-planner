import { Activity } from "../types/activity";
import { getDb } from "../../../database/db";

// Representación de una fila en SQLite.
// Los campos de tipo arreglo se guardan como JSON string.
interface ActivityRow {
  id: string;
  name: string;
  class_moment: string;
  primary_objective: string;
  secondary_objective: string | null;
  physical_capacity: string;
  min_participants: number;
  max_participants: number;
  suggested_grades: string;
  duration_minutes: number;
  intensity: string;
  space: string;
  equipment: string;
  description: string;
  organization: string;
  variants: string;
  safety_notes: string;
  observation_criteria: string;
  tags: string;
  is_favorite: number;
  created_at: string;
  updated_at: string;
}

function parseJsonField<T>(json: string): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return (json ? [json] : []) as unknown as T;
  }
}

// Convierte una fila de SQLite a un objeto Activity del dominio.
function fromActivityRow(row: ActivityRow): Activity {
  return {
    id: row.id,
    name: row.name,
    classMoment: row.class_moment as Activity["classMoment"],
    primaryObjective: row.primary_objective,
    secondaryObjective: row.secondary_objective ?? undefined,
    physicalCapacity: row.physical_capacity as Activity["physicalCapacity"],
    minParticipants: row.min_participants,
    maxParticipants: row.max_participants,
    suggestedGrades: parseJsonField<string[]>(row.suggested_grades),
    durationMinutes: row.duration_minutes,
    intensity: row.intensity as Activity["intensity"],
    space: row.space as Activity["space"],
    equipment: parseJsonField<string[]>(row.equipment),
    description: row.description,
    organization: row.organization,
    variants: parseJsonField<string[]>(row.variants),
    safetyNotes: row.safety_notes,
    observationCriteria: parseJsonField<string[]>(row.observation_criteria),
    tags: parseJsonField<string[]>(row.tags),
    isFavorite: row.is_favorite === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Convierte un Activity del dominio a un objeto plano para INSERT/UPDATE en SQLite.
function toActivityRow(activity: Activity): Omit<ActivityRow, "id"> & { id: string } {
  return {
    id: activity.id,
    name: activity.name,
    class_moment: activity.classMoment,
    primary_objective: activity.primaryObjective,
    secondary_objective: activity.secondaryObjective ?? null,
    physical_capacity: activity.physicalCapacity,
    min_participants: activity.minParticipants,
    max_participants: activity.maxParticipants,
    suggested_grades: JSON.stringify(activity.suggestedGrades),
    duration_minutes: activity.durationMinutes,
    intensity: activity.intensity,
    space: activity.space,
    equipment: JSON.stringify(activity.equipment),
    description: activity.description,
    organization: activity.organization,
    variants: JSON.stringify(activity.variants),
    safety_notes: activity.safetyNotes,
    observation_criteria: JSON.stringify(activity.observationCriteria),
    tags: JSON.stringify(activity.tags),
    is_favorite: activity.isFavorite ? 1 : 0,
    created_at: activity.createdAt,
    updated_at: activity.updatedAt,
  };
}

export async function getAllActivities(): Promise<Activity[]> {
  const database = await getDb();
  const rows = await database.select<ActivityRow[]>("SELECT * FROM activities ORDER BY created_at DESC");
  return rows.map(fromActivityRow);
}

export async function createActivity(activity: Activity): Promise<void> {
  const database = await getDb();
  const row = toActivityRow(activity);
  await database.execute(
    `INSERT INTO activities (id, name, class_moment, primary_objective, secondary_objective,
      physical_capacity, min_participants, max_participants, suggested_grades,
      duration_minutes, intensity, space, equipment, description, organization,
      variants, safety_notes, observation_criteria, tags, is_favorite, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
             $16, $17, $18, $19, $20, $21, $22)`,
    [
      row.id, row.name, row.class_moment, row.primary_objective, row.secondary_objective,
      row.physical_capacity, row.min_participants, row.max_participants, row.suggested_grades,
      row.duration_minutes, row.intensity, row.space, row.equipment, row.description,
      row.organization, row.variants, row.safety_notes, row.observation_criteria,
      row.tags, row.is_favorite, row.created_at, row.updated_at,
    ]
  );
}

export async function updateActivity(activity: Activity): Promise<void> {
  const database = await getDb();
  const row = toActivityRow(activity);
  await database.execute(
    `UPDATE activities SET
      name = $1, class_moment = $2, primary_objective = $3, secondary_objective = $4,
      physical_capacity = $5, min_participants = $6, max_participants = $7,
      suggested_grades = $8, duration_minutes = $9, intensity = $10, space = $11,
      equipment = $12, description = $13, organization = $14, variants = $15,
      safety_notes = $16, observation_criteria = $17, tags = $18, is_favorite = $19,
      created_at = $20, updated_at = $21
     WHERE id = $22`,
    [
      row.name, row.class_moment, row.primary_objective, row.secondary_objective,
      row.physical_capacity, row.min_participants, row.max_participants,
      row.suggested_grades, row.duration_minutes, row.intensity, row.space,
      row.equipment, row.description, row.organization, row.variants,
      row.safety_notes, row.observation_criteria, row.tags, row.is_favorite,
      row.created_at, row.updated_at, row.id,
    ]
  );
}

export async function deleteActivity(id: string): Promise<void> {
  const database = await getDb();
  await database.execute("DELETE FROM activities WHERE id = $1", [id]);
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  const database = await getDb();
  const now = new Date().toISOString();
  await database.execute(
    "UPDATE activities SET is_favorite = $1, updated_at = $2 WHERE id = $3",
    [isFavorite ? 1 : 0, now, id]
  );
}

// Exportadas para testing o uso futuro desde el formulario.
export { fromActivityRow, toActivityRow };
