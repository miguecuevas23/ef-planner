import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
import { getAllActivities, createActivity } from "../../activities/services/activityRepository";
import { Activity } from "../../activities/types/activity";
import { ActivitiesBackup, ImportResult } from "../types/backup";

const APP_NAME = "EF Planner";
const APP_VERSION = "1.0";

export async function exportActivitiesBackup(): Promise<void> {
  console.log("[Backup] Starting export");
  const activities = await getAllActivities();

  const backup: ActivitiesBackup = {
    app: APP_NAME,
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    totalActivities: activities.length,
    activities,
  };

  const json = JSON.stringify(backup, null, 2);
  const today = new Date().toISOString().slice(0, 10);
  const fileName = `ef-planner-backup-${today}.json`;

  const filePath = await save({
    defaultPath: fileName,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (!filePath) return;

  console.log("[Backup] Save path selected:", filePath);
  console.log("[Backup] Writing backup file");
  await writeTextFile(filePath, json);
  console.log("[Backup] Export completed");
}

function isValidActivity(obj: any): obj is Activity {
  return (
    obj &&
    typeof obj.id === "string" && obj.id.length > 0 &&
    typeof obj.name === "string" && obj.name.length > 0 &&
    typeof obj.classMoment === "string" &&
    typeof obj.physicalCapacity === "string" &&
    typeof obj.primaryObjective === "string" &&
    typeof obj.description === "string"
  );
}

export async function importActivitiesBackup(): Promise<ImportResult | null> {
  console.log("[Backup] Starting import");

  const filePath = await open({
    filters: [{ name: "JSON", extensions: ["json"] }],
    multiple: false,
  });

  if (!filePath) return null;

  console.log("[Backup] Open path selected:", filePath);

  const raw = await readTextFile(filePath as string);
  console.log("[Backup] Reading backup file");

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("El archivo no es un JSON válido.");
  }

  const backup = data as ActivitiesBackup;
  if (backup.app !== APP_NAME || !Array.isArray(backup.activities)) {
    throw new Error("El archivo no tiene el formato esperado de EF Planner.");
  }

  const existing = await getAllActivities();
  const existingIds = new Set(existing.map((a) => a.id));

  let imported = 0;
  let skipped = 0;

  for (const item of backup.activities) {
    if (!isValidActivity(item)) {
      skipped++;
      continue;
    }

    if (existingIds.has(item.id)) {
      skipped++;
      continue;
    }

    await createActivity(item);
    existingIds.add(item.id);
    imported++;
  }

  console.log("[Backup] Import completed");
  return { imported, skipped };
}
