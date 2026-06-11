import Database from "@tauri-apps/plugin-sql";
import { runDatabaseMigrations } from "./migrations";

let db: Database | null = null;
let migrationsApplied = false;

export async function getDb(): Promise<Database> {
  if (db) return db;

  try {
    console.log("[DB] Opening sqlite:ef_planner.db");
    db = await Database.load("sqlite:ef_planner.db");
    console.log("[DB] Database instance created");

    if (!migrationsApplied) {
      await runDatabaseMigrations(db);
      migrationsApplied = true;
    }

    return db;
  } catch (error) {
    console.error("[DB] Failed to open database", error);
    db = null;
    throw error;
  }
}
