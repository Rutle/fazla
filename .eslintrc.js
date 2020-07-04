module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    env: {
      browser: true,
      jest: true,
    },
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended'
    ],
    plugins: ['@typescript-eslint', 'react-hooks'],
    rules: {
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      "prettier/prettier": ["error", {
       "endOfLine":"auto"
     }],
    },
    settings: {
      'import/resolver': {
        node: {
          moduleDirectory: ['node_modules', 'src'],
        },
      },
    },
  }