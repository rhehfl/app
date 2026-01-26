import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const fsdLayers = [
  { type: 'app', pattern: 'app/**' },
  { type: 'pages', pattern: 'src/pages/**' },
  { type: 'widgets', pattern: 'src/widgets/**' },
  { type: 'features', pattern: 'src/features/**' },
  { type: 'entities', pattern: 'src/entities/**' },
  { type: 'shared', pattern: 'src/shared/**' },
];

const commonBaseRules = [
  {
    selector: 'default',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'import',
    format: ['camelCase', 'PascalCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'enumMember',
    format: ['UPPER_CASE'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'method',
    format: ['camelCase', 'snake_case'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'typeLike',
    format: ['PascalCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'variable',
    format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'parameter',
    format: ['camelCase', 'PascalCase', 'snake_case'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'classProperty',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'classProperty',
    modifiers: ['private'],
    format: ['camelCase', 'UPPER_CASE'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'objectLiteralProperty',
    format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'typeProperty',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'function',
    format: ['camelCase', 'PascalCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: [
      'classProperty',
      'objectLiteralProperty',
      'typeProperty',
      'classMethod',
      'objectLiteralMethod',
      'typeMethod',
      'accessor',
      'enumMember',
    ],
    format: null,
    modifiers: ['requiresQuotes'],
  },
];

const importOrder = () => [
  'error',
  {
    groups: [
      ['builtin', 'external'],
      ['internal'],
      ['parent', 'sibling', 'index'],
    ],
    pathGroups: [
      { pattern: 'react', group: 'external', position: 'before' },
      { pattern: 'expo', group: 'external', position: 'before' },
      ...fsdLayers.map((layer) => ({
        pattern: `@/${layer.type}/**`,
        group: 'internal',
        position: 'after',
      })),
    ],
    pathGroupsExcludedImportTypes: ['react', 'expo'],
    alphabetize: { order: 'asc', caseInsensitive: true },
    'newlines-between': 'always',
  },
];

export default tseslint.config(
  {
    ignores: [
      'dist',
      '.expo/**',
      'node_modules/**',
      '*.config.js',
      'babel.config.js',
      '.yarn/**',
      'routeTree.gen.ts',
      'build/**',
      '.next/**',
      '.cache',
      'tmp',
      'temp',
      '.tmp',
      '.vscode',
      '.idea',
      '*.swp',
      '*.swo',
      '.env.local',
      '.env.*.local',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'react-compiler': reactCompiler,
      'unused-imports': unusedImports,
      boundaries: boundaries,
    },
    settings: {
      react: { version: 'detect' },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
        node: true,
      },
      'boundaries/elements': fsdLayers,
      'import/external-module-folders': ['.yarn', 'node_modules'],
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/naming-convention': ['error', ...commonBaseRules],

      'import/order': importOrder(),
      'import/prefer-default-export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          name: 'lodash',
          message:
            'lodash는 CommonJS로 작성되어 있어 트리쉐이킹이 되지 않아 번들 사이즈를 크게 합니다. lodash/* 형식으로 import 해주세요.',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['draft'] },
      ],
    },
  },
);
