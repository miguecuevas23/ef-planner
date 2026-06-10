// Tipos centralizados para capacidades físicas.
// Usar siempre PhysicalCapacity en lugar de strings sueltos.
export type PhysicalCapacity = "resistencia" | "fuerza" | "velocidad" | "flexibilidad" | "coordinacion" | "equilibrio" | "agilidad" | "reaccion";

export type ClassMoment = "calentamiento" | "desarrollo" | "cierre";
export type IntensityLevel = "baja" | "media" | "alta";
export type Space = "sala" | "patio_pequeno" | "multicancha" | "gimnasio" | "cancha_grande";

export interface Activity {
  id: string;
  name: string;
  classMoment: ClassMoment;
  primaryObjective: string;
  secondaryObjective?: string;
  physicalCapacity: PhysicalCapacity;
  minParticipants: number;
  maxParticipants: number;
  suggestedGrades: string[];
  durationMinutes: number;
  intensity: IntensityLevel;
  space: Space;
  equipment: string[];
  description: string;
  organization: string;
  variants: string[];
  safetyNotes: string;
  observationCriteria: string[];
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
