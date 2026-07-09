// ESLint config — checks your JavaScript for likely mistakes.
// Kept gentle on purpose: problems show as warnings, not scary errors.
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Off on purpose: this game calls functions from inline onclick="..." handlers
      // in index.html, which ESLint can't see — so it would wrongly flag essential
      // functions (renderLeaderboard, saveCharacter, ...) as "unused". The rest of
      // ESLint's recommended checks (typos, undefined variables, real bugs) stay on.
      "no-unused-vars": "off",
      "no-undef": "warn",
    },
  },
  {
    // Don't lint the local dependency folder.
    ignores: ["node_modules/**"],
  },
];
