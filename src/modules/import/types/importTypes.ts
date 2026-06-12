import { Activity } from "../../activities/types/activity";

export interface ImportActivity {
  title?: string;
  description?: string;
  objective?: string;
  moment?: string;
  physicalCapacity?: string;
  intensity?: string;
  space?: string;
  materials?: string[];
  minStudents?: number;
  suggestedGrades?: string[];
}

export type ImportStatus = "ok" | "warning" | "error" | "duplicate";

export interface ImportPreviewItem {
  index: number;
  raw: ImportActivity;
  status: ImportStatus;
  warnings: string[];
  errors: string[];
  activity: Activity | null;
  isDuplicate: boolean;
  selected: boolean;
}

export type ImportFileType = "json" | "txt";
