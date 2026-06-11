import { getDb } from "./db";

export async function getMetadata(key: string): Promise<string | null> {
  const database = await getDb();
  const rows = await database.select<{ value: string }[]>(
    "SELECT value FROM app_metadata WHERE key = $1",
    [key]
  );
  return rows.length > 0 ? rows[0].value : null;
}

export async function setMetadata(key: string, value: string): Promise<void> {
  const database = await getDb();
  await database.execute(
    "INSERT OR REPLACE INTO app_metadata (key, value) VALUES ($1, $2)",
    [key, value]
  );
}

export async function getSchemaVersion(): Promise<number> {
  const value = await getMetadata("schema_version");
  return value ? Number(value) : 0;
}

export async function setSchemaVersion(version: number): Promise<void> {
  await setMetadata("schema_version", String(version));
}

export async function isSeedDone(): Promise<boolean> {
  const value = await getMetadata("seed_done");
  return value === "true";
}

export async function setSeedDone(): Promise<void> {
  await setMetadata("seed_done", "true");
}

export async function hasMigrationRun(id: string): Promise<boolean> {
  const database = await getDb();
  const rows = await database.select<{ id: string }[]>(
    "SELECT id FROM migration_history WHERE id = $1",
    [id]
  );
  return rows.length > 0;
}

export async function markMigrationRun(id: string): Promise<void> {
  const database = await getDb();
  const now = new Date().toISOString();
  await database.execute(
    "INSERT OR REPLACE INTO migration_history (id, applied_at) VALUES ($1, $2)",
    [id, now]
  );
}

export async function getSetting(key: string): Promise<string | null> {
  const database = await getDb();
  const rows = await database.select<{ value: string }[]>(
    "SELECT value FROM app_settings WHERE key = $1",
    [key]
  );
  return rows.length > 0 ? rows[0].value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDb();
  await database.execute(
    "INSERT OR REPLACE INTO app_settings (key, value) VALUES ($1, $2)",
    [key, value]
  );
}
