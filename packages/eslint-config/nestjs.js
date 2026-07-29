import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * ESLint configuration for NestJS backend applications.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    rules: {
      // NestJS uses constructor injection with parameter properties
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // NestJS decorators often need empty constructors
      "@typescript-eslint/no-empty-function": "off",
      // Interface declarations used by DI
      "@typescript-eslint/no-empty-interface": "off",
      // Allow `any` in specific cases (e.g., exception filters)
      "@typescript-eslint/no-explicit-any": "warn",
      // NestJS uses `require` for dynamic imports in some cases
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
