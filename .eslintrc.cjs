module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // React 17+ の新しいJSX Transformに対応
    'plugin:react-hooks/recommended',
    'airbnb',
    'prettier', // prettierは最後に記述
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    // 厳しすぎる、またはプロジェクトの方針に合わないルールを緩和
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 'off', // TypeScriptを導入する場合などは不要
    'import/prefer-default-export': 'off', // named exportを推奨する場合
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx'],
      },
      // Viteのエイリアス設定 `@` に対応
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  ignorePatterns: ['dist/', 'node_modules/', '.eslintrc.cjs', 'vite.config.js'],
}; 