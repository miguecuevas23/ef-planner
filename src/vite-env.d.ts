/// <reference types="vite/client" />

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_ENABLE_PLANNING_SKILLS?: string;
}

