-- Planning schema v4 (EF Planner 1.7.0-beta)
-- Agrega tablas de conocimientos a ef_planner_planning.db
-- Los conocimientos pasan a ser parte del módulo de Planificación

CREATE TABLE IF NOT EXISTS knowledge_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS knowledge_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  educational_level TEXT NOT NULL CHECK(educational_level IN ('basic', 'secondary')),
  course TEXT NOT NULL,
  category_id INTEGER,
  source TEXT,
  notes TEXT,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  FOREIGN KEY (category_id) REFERENCES knowledge_categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_knowledge_items_educational_level
  ON knowledge_items(educational_level);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_course
  ON knowledge_items(course);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_category_id
  ON knowledge_items(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_is_favorite
  ON knowledge_items(is_favorite);
