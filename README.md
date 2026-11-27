# Takoyaki（章魚燒）TRPG 平台

## 資料夾

- `client/`：前端（React + TypeScript + Vite）
- `server/`：後端（Node.js + Express + TypeScript）
- `shared/`：前後端共用的型別

## 本機啟動

需要 Node.js 22.22 以上（React Router 8 的要求）。用 `node -v` 確認版本。

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

## 新增頁面（路由）

前端用 React Router，路由會**自動收集**，新增頁面不用改 `client/src/App.tsx`：

1. 在自己的功能資料夾建立 `routes.tsx`，例如 `client/src/features/characters/routes.tsx`
2. 用 `export default` 匯出路由陣列：

```tsx
import type { RouteObject } from 'react-router';
import CharactersPage from './CharactersPage';

export default [{ path: '/characters', element: <CharactersPage /> }] satisfies RouteObject[];
```

- 頁面上方要有導覽列的話，在頁面元件裡放 `<TopNav />`（`client/src/components/TopNav.tsx`）。
- 頁面之間的連結用 `<Link to="/...">`，程式裡跳頁用 `useNavigate()`（都從 `react-router` 匯入），不要用 `<a href>`，否則會整頁重新載入。
- 沒有任何頁面認領的網址，會顯示前後端連線狀態頁（`client/src/StatusPage.tsx`）。
- 兩個功能宣告同一個網址時，開發中主控台會出現警告。

### 導覽列的返回鍵

全站統一規則（團隊決定）：

- 在某個區塊的**子畫面**（例如編輯角色卡、劇本詳細資訊、新增表單）時，返回鍵回到**該區塊的總覽**。
- 已經在總覽時，返回鍵回到**上一頁**；直接貼網址開的頁面沒有上一頁，就回首頁。
- 首頁不顯示返回鍵。

子畫面如果沒有自己的網址（只用 state 切換），請在子畫面時傳 `onBack` 給 `TopNav`，在總覽時不要傳：

```tsx
<TopNav onBack={tab !== 'roster' ? () => setTab('roster') : undefined} />
```

## 登入狀態（目前是假的）

- 首頁 `/` 與登入頁 `/login` 以外都需要登入；未登入會被導向 `/login?redirect=<原本的頁面>`。
- 登入狀態先用假的開關，預設是**已登入**。網址加 `?auth=out` 變成未登入、`?auth=in` 變回已登入（會記在瀏覽器，重新整理後仍有效）。
- 程式裡用 `client/src/auth/session.ts`：`useSignedIn()` 讀狀態、`signIn()`／`signOut()` 切換、`redirectAfterLogin(location.search)` 取得登入後要回去的頁面。
- 之後 account-auth 接上真的登入 API，只改 `session.ts` 裡面，其他頁面不用改。

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

## 共用確認視窗（ConfirmDialog）

刪除、確定離開、確定修改等「要使用者再按一次確認」的地方，一律用 `client/src/components/ConfirmDialog.tsx`，不要自己再做一個。

```tsx
import ConfirmDialog from '../../components/ConfirmDialog';

// 用條件決定要不要顯示，再把 {deleteDialog} 放進頁面的 JSX
const deleteDialog = confirmingDelete && (
  <ConfirmDialog
    title="刪除「夜行的圖書館」？"
    confirmLabel="確定刪除"
    onConfirm={remove}
    onCancel={() => setConfirmingDelete(false)}
    error={deleteError || undefined}
  >
    劇本的所有資料都會刪除，無法復原。
  </ConfirmDialog>
);
```

- 什麼時候顯示由頁面自己決定（條件渲染），元件只負責畫面與鍵盤操作。
- 按 Esc 或點視窗外面 = 取消；打開時焦點在「取消」，避免按 Enter 誤觸確認。
- `error`：有值時在說明下方顯示錯誤，視窗不關閉（例如刪除或存檔失敗）。
- `busy`：處理中（例如存檔中）按鈕停用，確認按鈕改顯示 `busyLabel`（預設「處理中…」）。
- `cancelLabel`：取消按鈕文字，預設「取消」。
