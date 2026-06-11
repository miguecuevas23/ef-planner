import { getAllActivities, createActivity } from "./activityRepository";
import { mockActivities } from "./mockActivities";

const SEED_KEY = "ef-planner-seed-done";

export async function seedActivities(): Promise<void> {
  const existing = await getAllActivities();
  if (existing.length > 0) return;

  const alreadySeeded = localStorage.getItem(SEED_KEY) === "true";
  if (alreadySeeded) return;

  for (const activity of mockActivities) {
    await createActivity(activity);
  }
  localStorage.setItem(SEED_KEY, "true");
}
