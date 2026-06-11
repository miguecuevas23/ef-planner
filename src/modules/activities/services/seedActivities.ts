import { getAllActivities, createActivity } from "./activityRepository";
import { isSeedDone, setSeedDone } from "../../../database/metadataRepository";
import { mockActivities } from "./mockActivities";

export async function seedActivities(): Promise<void> {
  // Migrar desde localStorage si existe
  if (localStorage.getItem("ef-planner-seed-done") === "true") {
    await setSeedDone();
    localStorage.removeItem("ef-planner-seed-done");
    return;
  }

  const existing = await getAllActivities();

  // Si ya hay actividades en BD y no está marcado como seed_done, marcar
  if (existing.length > 0) {
    const seeded = await isSeedDone();
    if (!seeded) await setSeedDone();
    return;
  }

  // BD vacía: verificar si ya se sembró antes
  const seeded = await isSeedDone();
  if (seeded) return;

  // Primera ejecución: insertar actividades de ejemplo
  for (const activity of mockActivities) {
    await createActivity(activity);
  }
  await setSeedDone();
}
