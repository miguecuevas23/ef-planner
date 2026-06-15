import { getPlanningDb } from "../../../database/planningDb";

export async function testPlanningConnection(): Promise<boolean> {
  try {
    const database = await getPlanningDb();
    await database.select<{ ok: number }[]>("SELECT 1 as ok");
    console.log("[Planning] Connection test: OK");
    return true;
  } catch (error) {
    console.error("[Planning] Connection test: FAILED", error);
    return false;
  }
}

export async function initializePlanningModule(): Promise<boolean> {
  try {
    console.log("[Planning] Initializing planning module...");
    await getPlanningDb();
    console.log("[Planning] Module initialized successfully");
    return true;
  } catch (error) {
    console.error("[Planning] Module initialization failed:", error);
    return false;
  }
}
