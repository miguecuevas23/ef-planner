export interface SelectOption {
  value: string;
  label: string;
}

export const CLASS_MOMENTS: SelectOption[] = [
  { value: "calentamiento", label: "Calentamiento" },
  { value: "desarrollo", label: "Desarrollo" },
  { value: "cierre", label: "Cierre" },
];

export const PHYSICAL_CAPACITIES: SelectOption[] = [
  { value: "resistencia", label: "Resistencia" },
  { value: "fuerza", label: "Fuerza" },
  { value: "velocidad", label: "Velocidad" },
  { value: "flexibilidad", label: "Flexibilidad" },
  { value: "coordinacion", label: "Coordinación" },
  { value: "equilibrio", label: "Equilibrio" },
  { value: "agilidad", label: "Agilidad" },
  { value: "reaccion", label: "Reacción" },
];

export const INTENSITY_LEVELS: SelectOption[] = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

export const SPACES: SelectOption[] = [
  { value: "sala", label: "Sala" },
  { value: "patio_pequeno", label: "Patio pequeño" },
  { value: "multicancha", label: "Multicancha" },
  { value: "gimnasio", label: "Gimnasio" },
  { value: "cancha_grande", label: "Cancha grande" },
];

export const COMMON_EQUIPMENT: SelectOption[] = [
  { value: "conos", label: "Conos" },
  { value: "balones", label: "Balones" },
  { value: "cuerdas", label: "Cuerdas" },
  { value: "colchonetas", label: "Colchonetas" },
  { value: "aros", label: "Aros" },
  { value: "petos", label: "Petos" },
  { value: "silbato", label: "Silbato" },
  { value: "cronometro", label: "Cronómetro" },
  { value: "bastones", label: "Bastones" },
  { value: "vallas", label: "Vallas" },
  { value: "pelotas_tenis", label: "Pelotas de tenis" },
  { value: "bancas", label: "Bancas" },
  { value: "elastico", label: "Elástico" },
  { value: "pizarra", label: "Pizarra" },
];

export const SUGGESTED_GRADES: SelectOption[] = [
  { value: "1°", label: "1° básico" },
  { value: "2°", label: "2° básico" },
  { value: "3°", label: "3° básico" },
  { value: "4°", label: "4° básico" },
  { value: "5°", label: "5° básico" },
  { value: "6°", label: "6° básico" },
  { value: "7°", label: "7° básico" },
  { value: "8°", label: "8° básico" },
  { value: "I", label: "I medio" },
  { value: "II", label: "II medio" },
  { value: "III", label: "III medio" },
  { value: "IV", label: "IV medio" },
];
