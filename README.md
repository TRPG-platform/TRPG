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
