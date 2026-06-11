import { getAllActivities, createActivity } from "./activityRepository";
import { mockActivities } from "./mockActivities";

const SEED_KEY = "ef-planner-seed-done";

export async function seedActivities(): Promise<void> {
  console.log("[Seed] Checking initial activities...");

  const existing = await getAllActivities();
  if (existing.length > 0) {
    console.log("[Seed] Activities already exist. Skipping seed.");
    return;
  }

  // Solo siembra si nunca se hizo antes (protege contra re-siembra tras eliminación manual).
  const alreadySeeded = localStorage.getItem(SEED_KEY) === "true";
  if (alreadySeeded) {
    console.log("[Seed] Seed already done in a previous session. Skipping.");
    return;
  }

  console.log("[Seed] First run — seeding mock activities...");
  for (const activity of mockActivities) {
    await createActivity(activity);
  }
  localStorage.setItem(SEED_KEY, "true");
  console.log("[Seed] Initial activities inserted. Seed marked as done.");
}
