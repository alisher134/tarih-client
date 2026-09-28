import { defineConfig } from "lint-staged/config";

export default defineConfig({
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md,yml,yaml}": ["prettier --write"],
});
