import { getSetting, setSetting } from "../../../database/metadataRepository";

export async function getCheckUpdatesOnStartup(): Promise<boolean> {
  const value = await getSetting("check_updates_on_startup");
  return value !== "false";
}

export async function setCheckUpdatesOnStartup(value: boolean): Promise<void> {
  await setSetting("check_updates_on_startup", value ? "true" : "false");
}

export async function getUpdateChannel(): Promise<"beta" | "stable"> {
  const value = await getSetting("update_channel");
  return value === "stable" ? "stable" : "beta";
}

export async function setUpdateChannel(channel: "beta" | "stable"): Promise<void> {
  await setSetting("update_channel", channel);
}
