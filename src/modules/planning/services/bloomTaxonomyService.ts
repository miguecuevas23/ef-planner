import taxonomyData from "../data/taxonomia_de_bloom.json";
import { BloomTaxonomyData, BloomLevel, BloomTaxonomyLevel } from "../types/skillObjective";

let cached: BloomTaxonomyData | null = null;

function loadTaxonomy(): BloomTaxonomyData {
  if (cached) return cached;

  const data = taxonomyData as BloomTaxonomyData;

  const required: BloomLevel[] = [
    "RECORDAR", "COMPRENDER", "APLICAR",
    "ANALIZAR", "EVALUAR", "CREAR",
  ];

  for (const level of required) {
    if (!data.levels[level]) {
      throw new Error(`[BloomTaxonomy] Missing required level: ${level}`);
    }
  }

  cached = data;
  console.log("[BloomTaxonomy] Taxonomy loaded —", Object.keys(data.levels).length, "levels");
  return data;
}

export function getBloomLevels(): BloomLevel[] {
  return Object.keys(loadTaxonomy().levels) as BloomLevel[];
}

export function getLowerOrderLevels(): BloomLevel[] {
  return getBloomLevels().filter((l) => loadTaxonomy().levels[l].order === "lower");
}

export function getHigherOrderLevels(): BloomLevel[] {
  return getBloomLevels().filter((l) => loadTaxonomy().levels[l].order === "higher");
}

export function getBloomLevelData(level: BloomLevel): BloomTaxonomyLevel {
  const data = loadTaxonomy().levels[level];
  if (!data) throw new Error(`[BloomTaxonomy] Level not found: ${level}`);
  return data;
}

export function getPrimaryVerbs(level: BloomLevel): string[] {
  return getBloomLevelData(level).actions;
}

export function getSecondaryKeywords(level: BloomLevel): string[] {
  return getBloomLevelData(level).keywords;
}
