module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    'no-plusplus': 'off',
    'no-console': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
};
