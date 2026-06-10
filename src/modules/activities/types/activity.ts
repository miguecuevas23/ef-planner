export interface Activity {
  id: string;
  name: string;
  classMoment: "calentamiento" | "desarrollo" | "cierre";
  primaryObjective: string;
  secondaryObjective?: string;
  physicalCapacity: "resistencia" | "fuerza" | "velocidad" | "flexibilidad" | "coordinacion" | "equilibrio" | "agilidad" | "reaccion";
  minParticipants: number;
  maxParticipants: number;
  suggestedGrades: string[];
  durationMinutes: number;
  intensity: "baja" | "media" | "alta";
  space: "sala" | "patio_pequeno" | "multicancha" | "gimnasio" | "cancha_grande";
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
