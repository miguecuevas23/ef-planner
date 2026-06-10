import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  // Abre SQLite en el directorio de datos de la app.
  // El archivo ef_planner.db se crea automáticamente si no existe.
  db = await Database.load("sqlite:ef_planner.db");

  // Ejecuta migración inicial: crea la tabla si no existe.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      class_moment TEXT NOT NULL,
      primary_objective TEXT NOT NULL,
      secondary_objective TEXT,
      physical_capacity TEXT NOT NULL,
      min_participants INTEGER NOT NULL,
      max_participants INTEGER NOT NULL,
      suggested_grades TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      intensity TEXT NOT NULL,
      space TEXT NOT NULL,
      equipment TEXT NOT NULL,
      description TEXT NOT NULL,
      organization TEXT NOT NULL,
      variants TEXT NOT NULL,
      safety_notes TEXT NOT NULL,
      observation_criteria TEXT NOT NULL,
      tags TEXT NOT NULL,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  return db;
}
