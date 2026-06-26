export type EducationLevel = "basic" | "secondary";

export interface KnowledgeCategory {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeItem {
  id: number;
  uuid: string;
  title: string;
  description: string;
  educationalLevel: EducationLevel;
  course: string;
  categoryId: number | null;
  categoryName: string | null;
  source: string | null;
  notes: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface KnowledgeItemDraft {
  title: string;
  description: string;
  educationalLevel: EducationLevel;
  course: string;
  categoryId: number | null;
  source: string;
  notes: string;
}

export const SUGGESTED_GRADES = [
  "1° Básico", "2° Básico", "3° Básico", "4° Básico",
  "5° Básico", "6° Básico", "7° Básico", "8° Básico",
  "I° Medio", "II° Medio", "III° Medio", "IV° Medio",
];

export const DEFAULT_CATEGORIES = [
  "Motricidad",
  "Juegos y Deportes",
  "Condición Física",
  "Salud y Vida Activa",
  "Expresión Corporal",
  "Danza",
  "Estrategias y Tácticas",
  "Entrenamiento",
  "Autocuidado y Seguridad",
  "Primeros Auxilios",
  "Liderazgo y Participación",
  "Vida Activa y Comunidad",
];
