import { getPlanningDb } from "../../../database/planningDb";
import { SkillObjective, SkillObjectiveGrade, SkillObjectiveDraft, SkillObjectiveStatus, PhysicalCapacity } from "../types/skillObjective";

interface SkillObjectiveRow {
  id: string;
  skill_text: string;
  generated_text: string;
  education_level: string;
  bloom_level: string;
  verb: string;
  skill_category: string;
  skill_detail: string;
  context_condition: string | null;
  custom_final_text: string | null;
  taxonomy_version: string;
  status: string;
  is_favorite: number;
  notes: string | null;
  physical_capacity: string | null;
  created_at: string;
  updated_at: string;
}

interface SkillObjectiveGradeRow {
  skill_objective_id: string;
  grade: string;
  is_primary: number;
  created_at: string;
}

function generateId(): string {
  return `sk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildSkillText(o: SkillObjectiveRow): string {
  return o.custom_final_text && o.custom_final_text.trim().length > 0
    ? o.custom_final_text
    : o.generated_text;
}

async function loadGrades(skillObjectiveId: string): Promise<SkillObjectiveGrade[]> {
  const db = await getPlanningDb();
  const rows = await db.select<SkillObjectiveGradeRow[]>(
    "SELECT * FROM skill_objective_grades WHERE skill_objective_id = $1",
    [skillObjectiveId]
  );
  return rows.map((r) => ({
    skillObjectiveId: r.skill_objective_id,
    grade: r.grade,
    isPrimary: r.is_primary === 1,
    createdAt: r.created_at,
  }));
}

export async function getAllSkillObjectives(): Promise<SkillObjective[]> {
  console.log("[PlanningSkills] Loading skill objectives");
  const db = await getPlanningDb();
  const rows = await db.select<SkillObjectiveRow[]>(
    "SELECT * FROM skill_objectives ORDER BY created_at DESC"
  );
  const result: SkillObjective[] = [];
  for (const row of rows) {
    const grades = await loadGrades(row.id);
    result.push({
      id: row.id,
      skillText: buildSkillText(row),
      generatedText: row.generated_text,
      educationLevel: row.education_level as SkillObjective["educationLevel"],
      bloomLevel: row.bloom_level as SkillObjective["bloomLevel"],
      verb: row.verb,
      skillCategory: row.skill_category as SkillObjective["skillCategory"],
      skillDetail: row.skill_detail,
      contextCondition: row.context_condition,
      customFinalText: row.custom_final_text,
      taxonomyVersion: row.taxonomy_version,
      status: row.status as SkillObjectiveStatus,
      isFavorite: row.is_favorite === 1,
      notes: row.notes,
      physicalCapacity: (row.physical_capacity as PhysicalCapacity) ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      grades,
    });
  }
  return result;
}

export async function getSkillObjectiveById(id: string): Promise<SkillObjective | null> {
  const db = await getPlanningDb();
  const rows = await db.select<SkillObjectiveRow[]>(
    "SELECT * FROM skill_objectives WHERE id = $1",
    [id]
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  const grades = await loadGrades(row.id);
  return {
    id: row.id,
    skillText: buildSkillText(row),
    generatedText: row.generated_text,
    educationLevel: row.education_level as SkillObjective["educationLevel"],
    bloomLevel: row.bloom_level as SkillObjective["bloomLevel"],
    verb: row.verb,
    skillCategory: row.skill_category as SkillObjective["skillCategory"],
    skillDetail: row.skill_detail,
    contextCondition: row.context_condition,
    customFinalText: row.custom_final_text,
    taxonomyVersion: row.taxonomy_version,
    status: row.status as SkillObjectiveStatus,
    isFavorite: row.is_favorite === 1,
    notes: row.notes,
    physicalCapacity: (row.physical_capacity as PhysicalCapacity) ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    grades,
  };
}

function composeGeneratedText(draft: SkillObjectiveDraft): string {
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

export async function createSkillObjective(draft: SkillObjectiveDraft): Promise<string> {
  console.log("[PlanningSkills] Creating skill objective");
  const db = await getPlanningDb();
  const id = generateId();
  const now = new Date().toISOString();
  const generatedText = composeGeneratedText(draft);
  const skillText = draft.customFinalText?.trim() || generatedText;

  await db.execute(
    `INSERT INTO skill_objectives (id, skill_text, generated_text, education_level, bloom_level, verb,
       skill_category, skill_detail, context_condition,
       custom_final_text, taxonomy_version, status, is_favorite, notes, physical_capacity, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
      id, skillText, generatedText, draft.educationLevel, draft.bloomLevel, draft.verb,
      draft.skillCategory, draft.skillDetail,
      draft.contextCondition || null,
      draft.customFinalText || null, "1.0", draft.status || "draft", 0,
      draft.notes || null, draft.physicalCapacity ?? null, now, now,
    ]
  );

  for (const grade of draft.grades) {
    await db.execute(
      "INSERT INTO skill_objective_grades (skill_objective_id, grade, is_primary, created_at) VALUES ($1,$2,$3,$4)",
      [id, grade, draft.primaryGrade === grade ? 1 : 0, now]
    );
  }

  console.log("[PlanningSkills] Skill objective created:", id);
  return id;
}

export async function updateSkillObjective(id: string, draft: SkillObjectiveDraft): Promise<void> {
  console.log("[PlanningSkills] Updating skill objective:", id);
  const db = await getPlanningDb();
  const now = new Date().toISOString();
  const generatedText = composeGeneratedText(draft);
  const skillText = draft.customFinalText?.trim() || generatedText;

  await db.execute(
    `UPDATE skill_objectives SET skill_text=$1, generated_text=$2, education_level=$3, bloom_level=$4,
       verb=$5, skill_category=$6, skill_detail=$7, context_condition=$8,
       custom_final_text=$9, status=$10, notes=$11, physical_capacity=$12, updated_at=$13
     WHERE id=$14`,
    [
      skillText, generatedText, draft.educationLevel, draft.bloomLevel, draft.verb,
      draft.skillCategory, draft.skillDetail,
      draft.contextCondition || null,
      draft.customFinalText || null, draft.status || "draft", draft.notes || null,
      draft.physicalCapacity ?? null, now, id,
    ]
  );

  await db.execute("DELETE FROM skill_objective_grades WHERE skill_objective_id = $1", [id]);
  for (const grade of draft.grades) {
    await db.execute(
      "INSERT INTO skill_objective_grades (skill_objective_id, grade, is_primary, created_at) VALUES ($1,$2,$3,$4)",
      [id, grade, draft.primaryGrade === grade ? 1 : 0, now]
    );
  }

  console.log("[PlanningSkills] Skill objective updated:", id);
}

export async function deleteSkillObjective(id: string): Promise<void> {
  console.log("[PlanningSkills] Deleting skill objective:", id);
  const db = await getPlanningDb();
  await db.execute("DELETE FROM skill_objectives WHERE id = $1", [id]);
  console.log("[PlanningSkills] Skill objective deleted:", id);
}

export async function duplicateSkillObjective(id: string): Promise<string> {
  const original = await getSkillObjectiveById(id);
  if (!original) throw new Error("Skill objective not found");

  const draft: SkillObjectiveDraft = {
    educationLevel: original.educationLevel,
    grades: original.grades.map((g) => g.grade),
    primaryGrade: original.grades.find((g) => g.isPrimary)?.grade ?? null,
    bloomLevel: original.bloomLevel,
    verb: original.verb,
    skillCategory: original.skillCategory,
    skillDetail: original.skillDetail,
    contextCondition: original.contextCondition ?? "",
    customFinalText: original.customFinalText ?? "",
    notes: original.notes ?? "",
    status: "draft",
    physicalCapacity: original.physicalCapacity ?? null,
  };

  return createSkillObjective(draft);
}

export async function toggleSkillObjectiveFavorite(id: string): Promise<void> {
  const db = await getPlanningDb();
  const rows = await db.select<{ is_favorite: number }[]>(
    "SELECT is_favorite FROM skill_objectives WHERE id = $1",
    [id]
  );
  if (rows.length === 0) return;
  const next = rows[0].is_favorite === 1 ? 0 : 1;
  await db.execute(
    "UPDATE skill_objectives SET is_favorite = $1, updated_at = $2 WHERE id = $3",
    [next, new Date().toISOString(), id]
  );
}

export async function getSkillObjectivesByGrade(grade: string): Promise<SkillObjective[]> {
  const db = await getPlanningDb();
  const rows = await db.select<{ skill_objective_id: string }[]>(
    "SELECT DISTINCT skill_objective_id FROM skill_objective_grades WHERE grade = $1",
    [grade]
  );
  const result: SkillObjective[] = [];
  for (const row of rows) {
    const obj = await getSkillObjectiveById(row.skill_objective_id);
    if (obj) result.push(obj);
  }
  return result;
}

export async function getSkillObjectivesByEducationLevel(level: string): Promise<SkillObjective[]> {
  const db = await getPlanningDb();
  const rows = await db.select<SkillObjectiveRow[]>(
    "SELECT * FROM skill_objectives WHERE education_level = $1 ORDER BY created_at DESC",
    [level]
  );
  const result: SkillObjective[] = [];
  for (const row of rows) {
    const grades = await loadGrades(row.id);
    result.push({
      id: row.id,
      skillText: buildSkillText(row),
      generatedText: row.generated_text,
      educationLevel: row.education_level as SkillObjective["educationLevel"],
      bloomLevel: row.bloom_level as SkillObjective["bloomLevel"],
      verb: row.verb,
      skillCategory: row.skill_category as SkillObjective["skillCategory"],
      skillDetail: row.skill_detail,
      contextCondition: row.context_condition,
      customFinalText: row.custom_final_text,
      taxonomyVersion: row.taxonomy_version,
      status: row.status as SkillObjectiveStatus,
      isFavorite: row.is_favorite === 1,
      notes: row.notes,
      physicalCapacity: (row.physical_capacity as PhysicalCapacity) ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      grades,
    });
  }
  return result;
}
