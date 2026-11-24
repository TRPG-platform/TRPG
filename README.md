# Takoyaki（章魚燒）TRPG 平台

## 資料夾

- `client/`：前端（React + TypeScript + Vite）
- `server/`：後端（Node.js + Express + TypeScript）
- `shared/`：前後端共用的型別

## 本機啟動

需要 Node.js 20 以上。

```bash
npm install
npm run dev
```

- 前端：http://localhost:5173 （畫面顯示「後端連線 OK」就代表前後端接通）
- 後端健康檢查：http://localhost:3001/api/health → `{ "ok": true }`
- 前端的 `/api/*` 會自動轉給後端，前端程式直接 `fetch('/api/...')` 即可。

## 建置

```bash
npm run build
```

依序建置 `shared` → `server` → `client`。

## 程式碼檢查與排版

```bash
npm run lint          # ESLint 檢查 client / server / shared
npm run format        # Prettier 自動排版
npm run format:check  # 只檢查排版，不改檔（適合送 PR 前跑）
```

- 設定檔在 repo 根目錄：`eslint.config.js`、`.prettierrc.json`、`.prettierignore`。
- 排版交給 Prettier（單引號、每行 100 字），ESLint 只管程式邏輯，兩者不衝突。
- 建議在 VS Code 安裝 ESLint 與 Prettier 擴充套件，並開啟「存檔時自動排版」。
