# Arquitectura del componente de habilidad (Skill Objective)

## Diferencia entre habilidad y OA completo

Un Objetivo de Aprendizaje (OA) completo en Educación Física se compone de tres
componentes:

1. **Habilidad** (acción motriz observable)
2. **Conocimiento** (saber conceptual asociado)
3. **Actitud** (disposición o valor)

En EF Planner 1.6.0 solo se implementa el componente de **habilidad**. Los
conocimientos y actitudes se incorporarán en versiones futuras.

## Cuatro categorías de habilidad

| Categoría | Clave | Descripción |
|-----------|-------|-------------|
| Patrones Motores | `motor_pattern` | Forma organizada y observable con la que se ejecuta un movimiento |
| Habilidades motrices básicas | `basic_motor_skill` | Acciones motrices fundamentales que sirven como base para aprendizajes posteriores |
| Habilidades motrices específicas | `specific_motor_skill` | Aplicación o combinación de habilidades básicas en una actividad o deporte |
| Habilidades motrices especializadas | `specialized_motor_skill` | Ejecuciones motrices refinadas que integran habilidades en situaciones de mayor exigencia |

## Diferencia entre patrón motor, habilidad básica, específica y especializada

- **Patrón motor**: la forma del movimiento (ej: patrón de carrera).
- **Habilidad motriz básica**: la acción fundamental (ej: correr).
- **Habilidad motriz específica**: la aplicación en contexto (ej: conducir un balón).
- **Habilidad motriz especializada**: la ejecución refinada (ej: remate en suspensión).

## Relación con Gallahue (referencia documental)

Las fases del desarrollo motor de Gallahue son una referencia pedagógica, no una
clasificación seleccionable en EF Planner:

- Fase de movimientos reflejos
- Fase de movimientos rudimentarios
- Fase de movimientos fundamentales
- Fase de movimientos especializados

Las categorías de EF Planner no son una copia literal de estas fases. Un
estudiante puede presentar niveles diferentes según la habilidad o tarea motriz.

## Eliminación del criterio de ejecución

El campo `performance_criterion` fue eliminado del modelo en 1.6.0. La columna
no se incluye en la migración inicial y no se usa en la UI ni en la generación
de texto.

## Nueva fórmula de generación

```
[Verbo] [patrón o habilidad] [contexto].
```

Ejemplo: `Ejecutar habilidades motrices básicas de lanzamiento y recepción mediante juegos recreativos.`

## Uso de la taxonomía de Bloom

La taxonomía de Bloom proporciona verbos de acción organizados en seis procesos
cognitivos. Se usa exclusivamente para guiar la construcción de la **habilidad**.

## Tablas

| Tabla | Uso |
|-------|-----|
| `skill_objectives` | Habilidad: verbo, Bloom, categoría, texto generado y final |
| `skill_objective_grades` | Cursos asociados a cada habilidad (1:N) |

## Feature flag

`VITE_ENABLE_PLANNING_SKILLS=true` habilita el constructor y la biblioteca.

## Preparación para bases curriculares chilenas

`skillCategory` y los cursos (`grade`) están diseñados para mapearse
posteriormente a los ejes y niveles de las bases curriculares chilenas de
Educación Física.
