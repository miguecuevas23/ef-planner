import { getAllActivities, createActivity } from "./activityRepository";
import { mockActivities } from "./mockActivities";

export async function seedActivities(): Promise<void> {
  console.log("[Seed] Checking initial activities...");

  const existing = await getAllActivities();
  if (existing.length > 0) {
    console.log("[Seed] Activities already exist. Skipping seed.");
    return;
  }

  console.log("[Seed] Database empty. Seeding mock activities...");
  for (const activity of mockActivities) {
    await createActivity(activity);
  }
  console.log("[Seed] Initial activities inserted.");
}
