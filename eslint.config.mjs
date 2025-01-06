import antfu from '@antfu/eslint-config';

export default antfu({
  astro: true,
  markdown: false,
  typescript: true,
  rules: {
    'consistent-list-newline': 'off',
    'no-console': 'warn',
    'curly': ['error', 'multi-line'],
    'max-statements-per-line': 'off',
    'brace-style': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'node/prefer-global/process': 'off',
    'import/no-duplicates': 'off',
    'unused-imports/no-unused-vars': 'off',
    'style/brace-style': ['error', '1tbs'],
    'style/no-tabs': 'off',
    'ts/consistent-type-imports': ['off'],
    'ts/no-unsafe-function-type': 'off',
  },
  stylistic: {
    semi: true,
  },
  ignores: ['public'],
});
