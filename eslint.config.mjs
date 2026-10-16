import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    ignores: [
      'dist/**',
      'node_modules/**',
    ],
  },
  stylistic.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-extra-semi': 'warn',
      'semi': ['warn', 'never'],
    },

  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
  },
])
