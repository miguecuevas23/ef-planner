-- Planning schema v3 (EF Planner 1.6.0-beta)
-- Agrega columna physical_capacity a skill_objectives

ALTER TABLE skill_objectives ADD COLUMN physical_capacity TEXT;

CREATE INDEX IF NOT EXISTS idx_skill_objectives_physical_capacity
  ON skill_objectives(physical_capacity);
