import Database from "@tauri-apps/plugin-sql";
import { DATABASE_SCHEMA_VERSION } from "../shared/constants/appVersion";

interface Migration {
  id: string;
  up: string;
}

// Migraciones incrementales. Cada una se ejecuta UNA sola vez.
// NUNCA usar DROP TABLE — los datos del usuario son intocables.
const migrations: Migration[] = [
  {
    id: "001_create_activities",
    up: `CREATE TABLE IF NOT EXISTS activities (
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
    );`,
  },
  {
    id: "002_create_app_metadata",
    up: `CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );`,
  },
  {
    id: "003_create_app_settings",
    up: `CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );`,
  },
];

// Recibe la instancia de Database como parámetro para romper la
// dependencia circular con getDb().
export async function runDatabaseMigrations(database: Database): Promise<void> {
  // Crear tabla de historial PRIMERO, antes de consultarla
  await database.execute(`
    CREATE TABLE IF NOT EXISTS migration_history (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  for (const migration of migrations) {
    const rows = await database.select<{ id: string }[]>(
      "SELECT id FROM migration_history WHERE id = $1",
      [migration.id]
    );

    if (rows.length > 0) continue;

    try {
      await database.execute(migration.up);
      const now = new Date().toISOString();
      await database.execute(
        "INSERT INTO migration_history (id, applied_at) VALUES ($1, $2)",
        [migration.id, now]
      );
    } catch (error) {
      console.error(`[Migration] Failed to run ${migration.id}:`, error);
      throw error;
    }
  }

  await database.execute(
    `INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('schema_version', $1)`,
    [String(DATABASE_SCHEMA_VERSION)]
  );
}
