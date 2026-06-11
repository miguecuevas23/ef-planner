import { Activity } from "../../activities/types/activity";

export interface ActivitiesBackup {
  app: "EF Planner";
  version: "1.0";
  exportedAt: string;
  totalActivities: number;
  activities: Activity[];
}

export interface ImportResult {
  imported: number;
  skipped: number;
}
