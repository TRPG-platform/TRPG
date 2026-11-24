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

## 前端資料來源

未設定時使用 `api`，沿用後端連線檢查。要單獨開前端，請將
`client/.env.example` 複製成 `client/.env`，保留 `VITE_DATA_SOURCE=mock`，
再從根目錄執行 `npm run dev -w client`。改成 `api` 後請重啟 Vite。

前端透過 `client/src/data/` 讀資料。後端目前提供 `/api/health`；
劇本、角色及房間 API 由各功能票接上。

## 建置

```bash
npm run build
```

依序建置 `shared` → `server` → `client`。

## 程式碼檢查與排版

```bash
npm run lint          # ESLint 檢查 client / server / shared，Stylelint 檢查 client 的 CSS
npm run format        # Prettier 自動排版
npm run format:check  # 只檢查排版，不改檔（適合送 PR 前跑）
```

- 設定檔在 repo 根目錄：`eslint.config.js`、`.stylelintrc.json`、`.prettierrc.json`、`.prettierignore`。
- 排版交給 Prettier（單引號、每行 100 字），ESLint 只管程式邏輯，兩者不衝突。
- 建議在 VS Code 安裝 ESLint 與 Prettier 擴充套件，並開啟「存檔時自動排版」。

## 設計變數（顏色、字型、圓角）

- 全站的顏色、字型、圓角定義在 `client/src/styles/tokens.css`，已在 `main.tsx` 全域引入。
- 寫樣式時一律用變數，例如 `background: var(--color-bg-panel);`、`border-radius: var(--radius-card);`。
- **不要寫死色碼**：`tokens.css` 以外的 TS/TSX 或 CSS 出現 `#fff` 這類色碼，`npm run lint` 會報錯。
- 需要新的顏色時，請開 PR 修改 `tokens.css`，不要在自己的檔案另外定義。
