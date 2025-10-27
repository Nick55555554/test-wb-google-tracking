import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';

const baseConfig = tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@', './src'], 
          ],
          extensions: ['.ts', '.js', '.json'], 
        },
      },
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module', 
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      '@stylistic': stylistic,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': 'error',
      'no-console': 'warn',
      '@stylistic/indent': ['error', 4], 
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'], 
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/space-before-function-paren': ['error', 'never'],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      
      'import/no-unresolved': 'error',
      'import/named': 'error', 
    },
  }
);

const testConfig = tseslint.config(
  {
    files: ['**/*.e2e-spec.ts', '**/*.test.ts'],
  }
);

export default [...baseConfig, ...testConfig];