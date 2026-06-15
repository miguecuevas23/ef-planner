import Database from "@tauri-apps/plugin-sql";

interface Migration {
  id: string;
  up: string;
}

const migrations: Migration[] = [
  {
    id: "001_create_planning_schema",
    up: `CREATE TABLE IF NOT EXISTS planning_schema_versions (
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
      ON lesson_plan_activities(activity_id);`,
  },
  {
    id: "002_create_skill_objectives",
    up: `CREATE TABLE IF NOT EXISTS skill_objectives (
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
      ON skill_objective_grades(skill_objective_id);`,
  },
  {
    id: "003_add_physical_capacities",
    up: `ALTER TABLE skill_objectives ADD COLUMN physical_capacity TEXT;

    CREATE INDEX IF NOT EXISTS idx_skill_objectives_physical_capacity
      ON skill_objectives(physical_capacity);`,
  },
];

export async function runPlanningMigrations(database: Database): Promise<void> {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS planning_migration_history (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  for (const migration of migrations) {
    const rows = await database.select<{ id: string }[]>(
      "SELECT id FROM planning_migration_history WHERE id = $1",
      [migration.id]
    );

    if (rows.length > 0) continue;

    try {
      await database.execute(migration.up);
      const now = new Date().toISOString();
      await database.execute(
        "INSERT INTO planning_migration_history (id, applied_at) VALUES ($1, $2)",
        [migration.id, now]
      );
      console.log(`[PlanningDB] Migration ${migration.id} applied`);
    } catch (error) {
      console.error(`[PlanningDB] Migration ${migration.id} failed:`, error);
      throw error;
    }
  }

  await database.execute(
    "INSERT OR REPLACE INTO planning_schema_versions (version, applied_at) VALUES (2, $1)",
    [new Date().toISOString()]
  );
}
