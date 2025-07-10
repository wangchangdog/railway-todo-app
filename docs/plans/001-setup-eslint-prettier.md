# ESLintとPrettierの導入計画

## 概要

プロジェクトのコード品質と一貫性を向上させるために、ESLintとPrettierを導入する。
Reactプロジェクト向けの推奨ルールセットをベースに、AirbnbのJavaScriptスタイルガイドを含む厳格なルールを適用する。

## 1. 必要なパッケージのインストール

以下のパッケージを`devDependencies`としてインストールする。

```bash
yarn add -D eslint prettier eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks
```

- **eslint**: コアライブラリ
- **prettier**: コードフォーマッター
- **eslint-config-airbnb**: Airbnbのスタイルガイドに基づく設定
- **eslint-config-prettier**: Prettierと競合するESLintルールを無効化
- **eslint-plugin-import**: ES Moduleのimport/export構文に関するルール
- **eslint-plugin-prettier**: PrettierのルールをESLintで実行
- **eslint-plugin-react**: React固有のルールセット
- **eslint-plugin-react-hooks**: React Hooksのルール

## 2. 設定ファイルの作成

### ESLint (`.eslintrc.cjs`)

プロジェクトルートに以下の内容で `.eslintrc.cjs` を作成する。

```javascript
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
```

### Prettier (`.prettierrc`)

プロジェクトルートに以下の内容で `.prettierrc` を作成する。

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## 3. package.json の更新

`scripts` に lint と format コマンドを追加する。

```json
"scripts": {
  "start": "vite",
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint 'src/**/*.{js,jsx}'",
  "lint:fix": "eslint 'src/**/*.{js,jsx}' --fix",
  "format": "prettier --write 'src/**/*.{js,jsx,css,md}' --ignore-path .gitignore"
},
```

## 4. 実行手順

1.  ターミナルで `yarn add -D ...` コマンドを実行し、パッケージをインストールする。
2.  `.eslintrc.cjs` と `.prettierrc` をプロジェクトルートに作成する。
3.  `package.json` の `scripts` を更新する。
4.  VSCodeなどのエディタにESLintとPrettierの拡張機能をインストールし、保存時の自動フォーマットを有効にすることを推奨する。
5.  `yarn lint` と `yarn format` を実行して、既存のコードにルールを適用し、正しく設定されているか確認する。 