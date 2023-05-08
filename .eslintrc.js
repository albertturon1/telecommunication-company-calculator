module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './',
      },
    },
  },
  ignorePatterns: ['next.config.js', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      arrowFunctions: true,
    },
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/jsx-runtime',
    'plugin:sonarjs/recommended',
    'prettier',
  ],

  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'prettier',
    'sonarjs',
    'import',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/hook-use-state': 'warn',
    'react/jsx-no-useless-fragment': 'warn',
    'no-console': ['warn', {allow: ['warn', 'error']}],
    '@typescript-eslint/restrict-template-expressions': [
      'warn',
      {allowNumber: true, allowBoolean: true},
    ],
    'prefer-arrow-callback': 'warn',
    'no-var': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@theme',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'react/jsx-filename-extension': [
      'error',
      {
        allow: 'as-needed',
        extensions: ['.tsx'],
      },
    ],
    'react/jsx-pascal-case': ['warn', {allowNamespace: true}],
    'react/jsx-boolean-value': 'warn',
    'react/no-array-index-key': 'error',
    'react/self-closing-comp': 'warn',
    'object-shorthand': 'warn',
    'quote-props': ['warn', 'as-needed'],
    'array-callback-return': 'warn',
    'prefer-destructuring': 'warn',
    'prefer-template': 'warn',
    'default-param-last': 'warn',
    'arrow-body-style': 'warn',
    'no-param-reassign': 'warn',
    'prefer-spread': 'warn',
    'import/no-mutable-exports': 'error',
    'no-duplicate-imports': 'warn',
    'no-lonely-if': 'warn',
    'no-nested-ternary': 'warn',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['./src/__tests__/**/*.tsx', './src/__tests__/**/*.ts'],
      rules: {},
    },
  ],
};
