import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  // Base configs
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // Custom rules
  {
    rules: {
      // Browser globals erlauben
      'no-undef': 'off',

      // Vue component naming - auf warning setzen statt error
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',

      // Unused vars - auf warning setzen
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_', // ← NEU!  Für catch blocks
        },
      ],
    },
  },

  // Node.js specific (für scripts/)
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },

  skipFormatting,
];
