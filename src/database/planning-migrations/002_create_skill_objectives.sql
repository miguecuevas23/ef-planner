-- Planning schema v2 (EF Planner 1.6.0-beta)
-- Agrega tablas para componentes de habilidad (skill objectives)
-- skill_category acepta: motor_pattern, basic_motor_skill, specific_motor_skill, specialized_motor_skill
-- performance_criterion NO se incluye. Se eliminó del modelo pedagógico.

CREATE TABLE IF NOT EXISTS skill_objectives (
  id TEXT PRIMARY KEY,
  skill_text TEXT NOT NULL,
  generated_text TEXT NOT NULL,
  education_level TEXT NOT NULL CHECK(education_level IN ('basic', 'secondary')),
  bloom_level TEXT NOT NULL CHECK(bloom_level IN ('RECORDAR', 'COMPRENDER', 'APLICAR', 'ANALIZAR', 'EVALUAR', 'CREAR')),
  verb TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  skill_detail TEXT NOT NULL,
  context_condition TEXT,
  custom_final_text TEXT,
  taxonomy_version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'ready', 'archived')),
  is_favorite INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS skill_objective_grades (
  skill_objective_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (skill_objective_id, grade),
  FOREIGN KEY (skill_objective_id) REFERENCES skill_objectives(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skill_objectives_education_level
  ON skill_objectives(education_level);
CREATE INDEX IF NOT EXISTS idx_skill_objectives_bloom_level
  ON skill_objectives(bloom_level);
CREATE INDEX IF NOT EXISTS idx_skill_objectives_skill_category
  ON skill_objectives(skill_category);
CREATE INDEX IF NOT EXISTS idx_skill_objectives_status
  ON skill_objectives(status);
CREATE INDEX IF NOT EXISTS idx_skill_objectives_is_favorite
  ON skill_objectives(is_favorite);
CREATE INDEX IF NOT EXISTS idx_skill_objectives_created_at
  ON skill_objectives(created_at);
CREATE INDEX IF NOT EXISTS idx_skill_objective_grades_grade
  ON skill_objective_grades(grade);
CREATE INDEX IF NOT EXISTS idx_skill_objective_grades_skill_id
  ON skill_objective_grades(skill_objective_id);
