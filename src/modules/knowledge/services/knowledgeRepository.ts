import { getPlanningDb } from "../../../database/planningDb";
import { KnowledgeItem, KnowledgeCategory, KnowledgeItemDraft, EducationLevel, DEFAULT_CATEGORIES } from "../types/knowledge";

interface KnowledgeItemRow {
  id: number;
  uuid: string;
  title: string;
  description: string;
  educational_level: string;
  course: string;
  category_id: number | null;
  source: string | null;
  notes: string | null;
  is_favorite: number;
  created_at: string;
  updated_at: string;
  version: string;
}

interface KnowledgeCategoryRow {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function initializeKnowledgeModule(): Promise<boolean> {
  try {
    const db = await getPlanningDb();
    const rows = await db.select<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM knowledge_categories"
    );
    if (rows[0].count === 0) {
      const now = new Date().toISOString();
      for (const name of DEFAULT_CATEGORIES) {
        await db.execute(
          "INSERT INTO knowledge_categories (uuid, name, created_at, updated_at) VALUES ($1, $2, $3, $4)",
          [generateUuid(), name, now, now]
        );
      }
      console.log("[Knowledge] Seeded default categories");
    }
    return true;
  } catch (e) {
    console.error("[Knowledge] Init failed:", e);
    return false;
  }
}

export async function getAllCategories(): Promise<KnowledgeCategory[]> {
  const db = await getPlanningDb();
  const rows = await db.select<KnowledgeCategoryRow[]>("SELECT * FROM knowledge_categories ORDER BY name");
  return rows.map((r) => ({
    id: r.id, uuid: r.uuid, name: r.name, description: r.description,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }));
}

export async function createCategory(name: string): Promise<KnowledgeCategory> {
  const db = await getPlanningDb();
  const now = new Date().toISOString();
  const uuid = generateUuid();
  const result = await db.execute(
    "INSERT INTO knowledge_categories (uuid, name, created_at, updated_at) VALUES ($1, $2, $3, $4)",
    [uuid, name, now, now]
  );
  return { id: result.lastInsertId as number, uuid, name, description: null, createdAt: now, updatedAt: now };
}

export async function getAllKnowledgeItems(): Promise<KnowledgeItem[]> {
  console.log("[Knowledge] Loading items");
  const db = await getPlanningDb();
  const rows = await db.select<(KnowledgeItemRow & { category_name: string | null })[]>(`
    SELECT ki.*, kc.name as category_name
    FROM knowledge_items ki
    LEFT JOIN knowledge_categories kc ON ki.category_id = kc.id
    ORDER BY ki.created_at DESC
  `);
  return rows.map(toKnowledgeItem);
}

export async function getKnowledgeItemById(id: number): Promise<KnowledgeItem | null> {
  const db = await getPlanningDb();
  const rows = await db.select<(KnowledgeItemRow & { category_name: string | null })[]>(
    `SELECT ki.*, kc.name as category_name
     FROM knowledge_items ki
     LEFT JOIN knowledge_categories kc ON ki.category_id = kc.id
     WHERE ki.id = $1`,
    [id]
  );
  if (rows.length === 0) return null;
  return toKnowledgeItem(rows[0]);
}

function toKnowledgeItem(row: KnowledgeItemRow & { category_name?: string | null }): KnowledgeItem {
  return {
    id: row.id, uuid: row.uuid, title: row.title, description: row.description,
    educationalLevel: row.educational_level as EducationLevel,
    course: row.course, categoryId: row.category_id, categoryName: row.category_name ?? null,
    source: row.source, notes: row.notes, isFavorite: row.is_favorite === 1,
    createdAt: row.created_at, updatedAt: row.updated_at, version: row.version,
  };
}

export async function createKnowledgeItem(draft: KnowledgeItemDraft): Promise<void> {
  console.log("[Knowledge] Creating item");
  const db = await getPlanningDb();
  const now = new Date().toISOString();
  const uuid = generateUuid();
  await db.execute(
    `INSERT INTO knowledge_items (uuid, title, description, educational_level, course,
       category_id, source, notes, is_favorite, created_at, updated_at, version)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [uuid, draft.title, draft.description, draft.educationalLevel, draft.course,
      draft.categoryId, draft.source || null, draft.notes || null, 0, now, now, "1.0"]
  );
  console.log("[Knowledge] Item created:", uuid);
}

export async function updateKnowledgeItem(id: number, draft: KnowledgeItemDraft): Promise<void> {
  console.log("[Knowledge] Updating item:", id);
  const db = await getPlanningDb();
  const now = new Date().toISOString();
  await db.execute(
    `UPDATE knowledge_items SET title=$1, description=$2, educational_level=$3, course=$4,
       category_id=$5, source=$6, notes=$7, updated_at=$8 WHERE id=$9`,
    [draft.title, draft.description, draft.educationalLevel, draft.course,
      draft.categoryId, draft.source || null, draft.notes || null, now, id]
  );
  console.log("[Knowledge] Item updated:", id);
}

export async function deleteKnowledgeItem(id: number): Promise<void> {
  console.log("[Knowledge] Deleting item:", id);
  const db = await getPlanningDb();
  await db.execute("DELETE FROM knowledge_items WHERE id = $1", [id]);
}

export async function duplicateKnowledgeItem(id: number): Promise<void> {
  const original = await getKnowledgeItemById(id);
  if (!original) throw new Error("Knowledge item not found");
  await createKnowledgeItem({
    title: original.title, description: original.description,
    educationalLevel: original.educationalLevel, course: original.course,
    categoryId: original.categoryId, source: original.source ?? "", notes: original.notes ?? "",
  });
}

export async function toggleKnowledgeFavorite(id: number): Promise<void> {
  const db = await getPlanningDb();
  const rows = await db.select<{ is_favorite: number }[]>(
    "SELECT is_favorite FROM knowledge_items WHERE id = $1", [id]
  );
  if (rows.length === 0) return;
  const next = rows[0].is_favorite === 1 ? 0 : 1;
  await db.execute(
    "UPDATE knowledge_items SET is_favorite = $1, updated_at = $2 WHERE id = $3",
    [next, new Date().toISOString(), id]
  );
}
