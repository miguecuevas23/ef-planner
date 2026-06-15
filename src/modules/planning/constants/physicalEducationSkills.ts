export interface SkillCategoryItem {
  value: string;
  label: string;
  description: string;
  examples: string[];
}

export interface PhysicalCapacityOption {
  value: string;
  label: string;
  examples: string[];
}

export const PHYSICAL_EDUCATION_SKILLS: SkillCategoryItem[] = [
  {
    value: "motor_pattern",
    label: "Patrones Motores",
    description:
      "Forma organizada y observable con la que se ejecuta un movimiento, como correr, saltar, lanzar, recibir, patear, girar o equilibrarse.",
    examples: [
      "patrón de carrera",
      "patrón de salto",
      "patrón de lanzamiento",
      "patrón de recepción",
      "patrón de pateo",
      "patrón de giro",
      "patrón de equilibrio",
    ],
  },
  {
    value: "basic_motor_skill",
    label: "Habilidades motrices básicas",
    description:
      "Acciones motrices fundamentales y de carácter general que sirven como base para aprendizajes posteriores.",
    examples: [
      "correr",
      "caminar",
      "saltar",
      "lanzar",
      "recibir",
      "patear",
      "desplazarse",
      "girar",
      "equilibrarse",
      "manipular objetos",
    ],
  },
  {
    value: "specific_motor_skill",
    label: "Habilidades motrices específicas",
    description:
      "Aplicación o combinación de habilidades básicas dentro de una actividad, juego, disciplina o deporte determinado.",
    examples: [
      "conducir un balón",
      "realizar un pase",
      "driblar",
      "sacar",
      "rematar",
      "realizar una secuencia gimnástica",
      "aplicar una técnica de nado",
    ],
  },
  {
    value: "specialized_motor_skill",
    label: "Habilidades motrices especializadas",
    description:
      "Ejecuciones motrices refinadas y complejas que integran habilidades específicas en situaciones de mayor exigencia.",
    examples: [
      "remate en suspensión",
      "salida de velocidad desde tacos",
      "combinación de dribling, pase y desmarque",
      "secuencia gimnástica avanzada",
      "técnica deportiva ejecutada bajo oposición",
      "ejecución técnica orientada al rendimiento",
    ],
  },
  {
    value: "physical_capacity",
    label: "Capacidades físicas",
    description:
      "Componentes que permiten desarrollar y controlar el rendimiento motor durante la actividad física, como la fuerza, velocidad, resistencia, coordinación y equilibrio.",
    examples: [
      "fuerza",
      "velocidad",
      "resistencia",
      "coordinación",
      "equilibrio",
    ],
  },
];

export const PHYSICAL_CAPACITIES: PhysicalCapacityOption[] = [
  {
    value: "strength",
    label: "Fuerza",
    examples: [
      "ejercicios orientados al desarrollo de la fuerza muscular",
      "acciones de empuje, tracción y sostén",
      "ejercicios de fuerza utilizando el propio peso corporal",
    ],
  },
  {
    value: "speed",
    label: "Velocidad",
    examples: [
      "desplazamientos de corta duración realizados a máxima velocidad",
      "velocidad de reacción ante estímulos",
      "cambios rápidos de dirección",
    ],
  },
  {
    value: "endurance",
    label: "Resistencia",
    examples: [
      "actividades orientadas al desarrollo de la resistencia cardiovascular",
      "ejercicios continuos de intensidad moderada",
      "juegos prolongados con regulación del esfuerzo",
    ],
  },
  {
    value: "coordination",
    label: "Coordinación",
    examples: [
      "combinación controlada de movimientos corporales",
      "coordinación de movimientos con objetos",
      "secuencias motrices realizadas con ritmo y precisión",
    ],
  },
  {
    value: "balance",
    label: "Equilibrio",
    examples: [
      "mantenimiento del equilibrio estático",
      "control del equilibrio durante desplazamientos",
      "recuperación de la estabilidad después de giros o saltos",
    ],
  },
];

export const SUGGESTED_GRADES_BASIC = [
  "1°", "2°", "3°", "4°", "5°", "6°", "7°", "8°",
];

export const SUGGESTED_GRADES_SECONDARY = [
  "I", "II", "III", "IV",
];

export const GRADE_LABELS: Record<string, string> = {
  "1°": "1° Básico",
  "2°": "2° Básico",
  "3°": "3° Básico",
  "4°": "4° Básico",
  "5°": "5° Básico",
  "6°": "6° Básico",
  "7°": "7° Básico",
  "8°": "8° Básico",
  "I": "1° Medio",
  "II": "2° Medio",
  "III": "3° Medio",
  "IV": "4° Medio",
};

export const CONTEXT_SUGGESTIONS = [
  "mediante ejercicios",
  "mediante juegos",
  "mediante deportes",
  "mediante ejercicios y juegos",
  "mediante juegos recreativos",
  "mediante deportes adaptados",
  "mediante situaciones motrices",
  "mediante circuitos",
  "mediante tareas individuales",
  "mediante tareas colaborativas",
];
