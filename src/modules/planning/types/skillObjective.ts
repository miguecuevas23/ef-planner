export type EducationLevel = "basic" | "secondary";

export type BloomLevel =
  | "RECORDAR"
  | "COMPRENDER"
  | "APLICAR"
  | "ANALIZAR"
  | "EVALUAR"
  | "CREAR";

export type SkillObjectiveStatus = "draft" | "ready" | "archived";

export type SkillCategory =
  | "motor_pattern"
  | "basic_motor_skill"
  | "specific_motor_skill"
  | "specialized_motor_skill"
  | "physical_capacity";

export type PhysicalCapacity =
  | "strength"
  | "speed"
  | "endurance"
  | "coordination"
  | "balance";

export interface SkillObjective {
  id: string;
  skillText: string;
  generatedText: string;
  educationLevel: EducationLevel;
  bloomLevel: BloomLevel;
  verb: string;
  skillCategory: SkillCategory;
  skillDetail: string;
  contextCondition: string | null;
  customFinalText: string | null;
  taxonomyVersion: string;
  status: SkillObjectiveStatus;
  isFavorite: boolean;
  physicalCapacity: PhysicalCapacity | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  grades: SkillObjectiveGrade[];
}

export interface SkillObjectiveGrade {
  skillObjectiveId: string;
  grade: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface SkillObjectiveDraft {
  educationLevel: EducationLevel | null;
  grades: string[];
  primaryGrade: string | null;
  bloomLevel: BloomLevel | null;
  verb: string;
  skillCategory: SkillCategory | null;
  skillDetail: string;
  contextCondition: string;
  customFinalText: string;
  notes: string;
  status: SkillObjectiveStatus;
  physicalCapacity: PhysicalCapacity | null;
}

export interface BloomTaxonomyLevel {
  order: "lower" | "higher";
  description: string;
  actions: string[];
  keywords: string[];
  results: string[];
  questions: string[];
}

export interface BloomTaxonomyData {
  version: string;
  title: string;
  levels: Record<BloomLevel, BloomTaxonomyLevel>;
}
