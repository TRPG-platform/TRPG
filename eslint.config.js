import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 整個 repo 共用一份 ESLint 設定，client / server / shared 依資料夾套用不同環境。
export default defineConfig(
  { ignores: ['**/dist/', '**/node_modules/', 'docs/'] },

  js.configs.recommended,
  tseslint.configs.recommended,

  // 前端：瀏覽器環境 + React Hooks 規則
  {
    files: ['client/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // 後端、共用型別與設定檔：Node.js 環境
  {
    files: ['server/**/*.ts', 'shared/**/*.ts', 'client/vite.config.ts', '*.js'],
    languageOptions: { globals: globals.node },
  },

  // 關掉所有和 Prettier 衝突的排版規則，排版一律交給 Prettier（必須放最後）
  prettier,
);
