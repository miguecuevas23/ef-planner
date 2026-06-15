export type LessonPlanStatus = "draft" | "ready" | "completed" | "archived";

export type ClassMoment = "inicio" | "desarrollo" | "cierre";

export interface LessonPlan {
  id: string;
  title: string;
  classDate: string | null;
  grade: string | null;
  durationMinutes: number | null;
  learningObjective: string | null;
  status: LessonPlanStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlanBlock {
  id: string;
  lessonPlanId: string;
  classMoment: ClassMoment;
  position: number;
  durationMinutes: number | null;
  objective: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlanActivity {
  id: string;
  lessonPlanId: string;
  blockId: string | null;
  activityId: string | null;
  activitySnapshotJson: string;
  position: number;
  durationMinutes: number | null;
  adaptationsJson: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanningSetting {
  key: string;
  value: string | null;
  updatedAt: string;
}
