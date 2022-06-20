module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['react', '@typescript-eslint'],
  extends: [
    'airbnb',
    'prettier',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-exports': 'off',

    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/member-delimiter-style': ['warn', {
      multiline: {
        delimiter: 'none',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    }],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/indent': ['warn', 2],

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/label-has-associated-control': 'off',

    'react/react-in-jsx-scope': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'react/prop-types': 'off',

    'react/jsx-wrap-multilines': ['warn', {
      'declaration': 'parens-new-line',
      'assignment': 'parens-new-line',
      'return': 'parens-new-line',
      'arrow': 'parens-new-line',
      'condition': 'ignore',
      'logical': 'ignore',
      'prop': 'ignore',
    }],

    'react/function-component-definition': ['warn', {
      'namedComponents': 'arrow-function',
      'unnamedComponents': 'function-expression',
    }],

    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': ['warn', 'as-needed'],
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'comma-dangle': 'warn',
    quotes: ['warn', 'single'],
    'linebreak-style': 'warn',
    'global-require': 'error',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'sort-keys': 'off',
    'indent': 'off', // Disabled because @typescript-eslint/indent
  },
}
