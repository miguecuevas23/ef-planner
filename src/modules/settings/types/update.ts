export type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "not_available"
  | "installing"
  | "error"
  | "not_configured";

export interface UpdateCheckResult {
  status: UpdateStatus;
  currentVersion: string;
  latestVersion?: string;
  message: string;
  notes?: string;
}
