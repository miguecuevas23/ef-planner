import Database from "@tauri-apps/plugin-sql";
import { runPlanningMigrations } from "./planningMigrations";

let planningDb: Database | null = null;
let planningMigrationsApplied = false;

export async function getPlanningDb(): Promise<Database> {
  if (planningDb) return planningDb;

  console.log("[PlanningDB] Opening planning database...");

  try {
    planningDb = await Database.load("sqlite:ef_planner_planning.db");
    console.log("[PlanningDB] Planning database ready");

    await planningDb.execute("PRAGMA foreign_keys = ON;");

    if (!planningMigrationsApplied) {
      console.log("[PlanningDB] Initializing planning schema...");
      await runPlanningMigrations(planningDb);
      planningMigrationsApplied = true;
      console.log("[PlanningDB] Planning schema ready");
    }

    return planningDb;
  } catch (error) {
    console.error("[PlanningDB] Failed to open planning database:", error);
    planningDb = null;
    throw error;
  }
}
