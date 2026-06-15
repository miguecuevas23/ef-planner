-- Planning schema v1 (EF Planner 1.5.0-beta)
-- Base SQLite independiente: ef_planner_planning.db
-- No tiene foreign keys con ef_planner.db

CREATE TABLE IF NOT EXISTS planning_schema_versions (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_plans (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  class_date TEXT,
  grade TEXT,
  duration_minutes INTEGER CHECK(duration_minutes IS NULL OR duration_minutes > 0),
  learning_objective TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK(status IN ('draft', 'ready', 'completed', 'archived')),
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_plan_blocks (
  id TEXT PRIMARY KEY,
  lesson_plan_id TEXT NOT NULL,
  class_moment TEXT NOT NULL,
  position INTEGER NOT NULL,
  duration_minutes INTEGER,
  objective TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_plan_id) REFERENCES lesson_plans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lesson_plan_activities (
  id TEXT PRIMARY KEY,
  lesson_plan_id TEXT NOT NULL,
  block_id TEXT,
  activity_id TEXT,
  activity_snapshot_json TEXT NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL,
  duration_minutes INTEGER,
  adaptations_json TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_plan_id) REFERENCES lesson_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (block_id) REFERENCES lesson_plan_blocks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS planning_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lesson_plans_class_date
  ON lesson_plans(class_date);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_grade
  ON lesson_plans(grade);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_status
  ON lesson_plans(status);
CREATE INDEX IF NOT EXISTS idx_lesson_plan_blocks_plan_position
  ON lesson_plan_blocks(lesson_plan_id, position);
CREATE INDEX IF NOT EXISTS idx_lesson_plan_activities_plan_position
  ON lesson_plan_activities(lesson_plan_id, position);
CREATE INDEX IF NOT EXISTS idx_lesson_plan_activities_block_position
  ON lesson_plan_activities(block_id, position);
CREATE INDEX IF NOT EXISTS idx_lesson_plan_activities_activity_id
  ON lesson_plan_activities(activity_id);
