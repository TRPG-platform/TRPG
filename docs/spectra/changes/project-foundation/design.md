## Context

repo 目前只有 Spectra 設定與文件，沒有程式碼。組員 5 人（A–E）要在 12/23 first demo 前並行開發 8 個功能，每個功能都需要同一套頁面外框、色彩字型與資料格式。技術選型在 docs/planning/feature-division.md 9-1 節仍標示「提案，待確認」。

## Design Source

- 來源：Figma 檔案 `x6ouzHCErrn0wFEuoL5nBD`，2026-11-20 以 REST API 匯出
- 快照：docs/design/figma/README.md（數值表）、docs/design/figma/frames/（畫面圖）、docs/design/figma/file.json（完整節點資料）
- 導覽列參考畫面：p1_TV-02.png、p1_TV-07.png；導覽項目一般／選取兩態：p1_x_18～22（首頁、設定、劇本管理、我的角色、教學與資源）；精簡頂欄參考：p1_TV-05.png、p1_TV-11.png
- 共用圖示：lobby_x_06～20（book、grid、list、search、chevron、down、plus、edit、more、bell、arrow、upload、star、clock、dice），設定齒輪圖示：p1_x_15_sun-regular-full1.png

| 項目 | 值 |
|---|---|
| 頁面背景 | `#211B23`（最深 `#17131D`） |
| 面板背景 | `#2B2232`、`#40313B` |
| 邊框 | `#51405C` |
| 次要文字 | `#B7AABB` |
| 主要文字 | `#F5EDF6` |
| 主色紫 | `#9972AD`（按鈕 `#9566C2`、淺紫 `#C4A0D3`） |
| 強調金 | `#E8D1A5` |
| 成功綠 / 失敗紅 | `#18DA11` / 紅色標籤（取自擲骰紀錄） |
| 內文字型 | Noto Sans TC 400，12–16px |
| 標題字型 | Noto Serif TC 700，20–32px |
| 圓角 | 卡片／面板 12px、按鈕／輸入框 8px |
| 導覽列高度 | 約 48px（畫面寬 1280px 時） |

## Goals / Non-Goals

**Goals:**

- 一個指令在本機同時啟動前端與後端。
- 所有頁面共用同一個導覽列與精簡頂欄。
- 設計變數、共用型別、假資料各只有一份。

**Non-Goals:**

- 不做任何單一功能的頁面內容（各功能由自己的規格書負責）。
- 不做部署（Docker／主機待老師與組員確認後另開規格書）。
- 不做資料庫結構；本規格書只定前後端交換的資料格式。
- 不做手機版排版；設計稿只有 1280–1600px 桌面版。

## Decisions

### 單一 repo 分三個資料夾

前端、後端、共用型別放在同一個 repo 的三個資料夾，用 npm workspaces 串起來。替代方案「前後端分兩個 repo」會讓共用型別要另外發布套件，對 5 人課堂專案太重。

### 技術選型已定案

前端 React + TypeScript + Vite，後端 Node.js + Express + TypeScript，即時同步 Socket.IO。2026-11-21 確認採用 feature-division.md 9-1 節的提案。React、TypeScript、Node.js + Express 課程都有教；Socket.IO 與資料庫課程沒教，由 room-lobby 的「試做即時連線」任務先行。

### 設計變數用 CSS 變數

色彩、字型、圓角定義成 CSS 自訂屬性（`--color-panel` 這類），放在一個全域樣式檔。不選 CSS-in-JS 主題物件，因為 CSS 變數不綁框架，組員用一般 CSS 或 CSS Modules 都能引用。

### 規則專屬資料放 ruleData

依 docs/guidelines/trpg-web-development.md 第 2、4 節「核心不內建規則」，Character 只放通用欄位，HP／SAN／屬性／技能放在 `ruleData`，由 `ruleSystem` 決定格式。角色卡規格書（character-card）負責定義百分骰規則的 `ruleData` 細節。

### 資料存取層可切換假資料

前端所有資料都經過同一個資料存取層，用環境變數 `VITE_DATA_SOURCE=mock|api` 切換。12/16 前大家用 mock 做畫面，12/17 起逐一改成 api，不用改頁面程式。

## Implementation Contract

- **行為**：`npm run dev` 在 repo 根目錄啟動前端（瀏覽器可開首頁）與後端（`GET /api/health` 回 `{ "ok": true }`）。登入後的每個非房間頁面頂部都是同一個導覽列，房間內頁面是精簡頂欄。
- **介面／資料形狀**：共用型別 `User`、`Script`、`Character`、`Room`、`Message` 依 shared-data-model 規格的欄位表；設計變數名稱依上方 Design Source 表的項目命名。
- **失敗模式**：未登入開受保護頁面 → 導向登入頁；`VITE_DATA_SOURCE` 為其他值 → 啟動時在主控台報錯並停止。
- **驗收**：`npm run build` 前後端都成功；`npm run lint` 對設計變數檔以外的色碼報錯；手動逐頁點導覽列，選取狀態正確。
- **範圍內**：專案骨架、導覽列、精簡頂欄、登入導向的路由守衛（登入狀態本身由 account-auth 提供，本規格先用假的登入狀態）、設計變數、共用型別、假資料。
- **範圍外**：各功能頁面內容、資料庫、部署、通知鈴鐺的內容（只放圖示）。

## Risks / Trade-offs

- [Socket.IO 與資料庫課程沒教] → room-lobby 第一個後端任務先試做即時連線（11/30 開始）。
- [共用型別被多人同時改造成衝突] → 改 `shared/` 一律開 PR 並請另一位組員審查（對應 feature-division.md 9-2 節的 AGENTS.md 提案）。
- [設計稿字型混用（SeoulHangang、Inter）] → 設計變數只收 Noto Sans TC／Noto Serif TC，其他字型列入待確認問題。

## Open Questions

無。2026-11-21 已決定（見 docs/planning/spec-discussion-2026-11-21.md）：

- 技術選型照提案。
- 導覽列不放「設定」，帳號設定放在頭像選單。
- 畫面照設計稿顯示 CoC 規則名稱（例如 CoC 7e）。


