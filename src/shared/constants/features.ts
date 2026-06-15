export const FEATURES = {
  planningPublic: false,
  planningSkillsExperimental:
    import.meta.env.VITE_ENABLE_PLANNING_SKILLS === "true",
} as const;
