import { getAllActivities, createActivity } from "./activityRepository";
import { mockActivities } from "./mockActivities";

// Inserta las actividades mock en SQLite si la base está vacía.
// Se llama una vez al iniciar la app. No duplica datos si ya existen.
export async function seedActivities(): Promise<void> {
  try {
    const existing = await getAllActivities();
    if (existing.length > 0) return;

    for (const activity of mockActivities) {
      await createActivity(activity);
    }
  } catch (error) {
    console.error("Error al sembrar actividades iniciales:", error);
  }
}
