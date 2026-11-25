# AGENTS.md

> 給組員和 AI 工具共同遵守的開發規範。
> 狀態：草稿，等開會確認。

**標記說明**

- 【既有】Spectra 文件、開發注意事項、README 或骨架已經這樣做
- 【試行】建議先照做，有意見再提
- 【待確認】要開會確認
- 【待討論】還沒有方案，開會一起討論

看到【待確認】或【待討論】的項目，組員和 AI 都不要自己決定。

---

## 1. 專案介紹

- Takoyaki（章魚燒）：線上 TRPG 平台，課堂專題，不公開上線。【既有】
- 五人團隊，整體採用黑暗色系。【既有】
- 核心不內建任何遊戲規則，規則用「規則模組」接上；第一個模組是百分骰判定。【既有】
- 開發注意事項（擲骰、權限、安全等）：見 `docs/guidelines/trpg-web-development.md`。【既有】

## 2. 技術統一

| 項目         | 選擇                                                                                   | 狀態       |
| ------------ | -------------------------------------------------------------------------------------- | ---------- |
| 專案結構     | npm workspaces（`shared`、`server`、`client`），需要 Node.js 20 以上                   | 【既有】   |
| 前端         | React + Vite + TypeScript、HTML、CSS                                                   | 【既有】   |
| 後端         | Node.js + Express（TypeScript）                                                        | 【既有】   |
| API 串接     | Axios、Fetch（目前骨架用原生 `fetch`）                                                 | 【待討論】 |
| 即時同步     | Socket.IO，11/30 試做後定案（`project-foundation/design.md` 寫已定案，狀態待開會對齊） | 【試行】   |
| 程式碼格式   | ESLint + Stylelint + Prettier                                                          | 【既有】   |
| 資料庫、部署 | 還沒決定                                                                               | 【待討論】 |

- 頁面不能直接呼叫 `fetch`（或之後選定的 HTTP 套件），一律經過 `client/src/data/` 資料存取層。【既有】
- 資料存取層用 `VITE_DATA_SOURCE=mock|api` 切換假資料和真資料。【既有】
  - 沒有設定時，預設使用 `api`；如果值不是 `mock` 或 `api`，Vite 啟動時會直接顯示錯誤。
  - 要使用假資料：把 `client/.env.example` 複製成 `client/.env`；修改設定後要重新啟動 Vite。
  - 新增資料讀取函式時，請使用 `readData(path, getMockData, signal)`；假資料放在 `client/src/data/mock.ts`。
- 要新增套件，先在 DC 提出。【試行】

## 3. 專案架構【待討論】

目前 `dev` 上的骨架（PR #11–#15）：

```
client/   前端（React）
server/   後端（Express）
shared/   前後端共用的型別
```

`client/src/` 目前已有：

```
data/     資料存取層
styles/   設計變數（tokens.css）與全站基本樣式（global.css）
```

建議再加：

```
features/    各功能，一個功能一個資料夾
components/  共用元件
```

- 資料存取層沿用目前骨架的 `client/src/data/`，不改名為 `api/`。【既有】
- 共用型別只放在 `shared/`，其他地方不能重新宣告。【既有】
  - 目前 lint 還無法檢查是否重新宣告（任務 2.2／#9 尚未完成），請自行注意。
  - 修改 `shared/` 後要重新 build（`npm run build -w shared`），因為前後端讀取的是 `shared/dist`；執行 `npm run dev` 時會自動先 build 一次。
- 架構確定前，不要搬動或重新命名資料夾。

## 4. 檔案、元件與變數命名規範【試行】

| 對象       | 規則                     | 例子               |
| ---------- | ------------------------ | ------------------ |
| 元件檔     | 大駝峰，一個檔案一個元件 | `DiceForm.tsx`     |
| 資料夾     | 小寫加連字號             | `script-import/`   |
| 變數、函式 | 小駝峰                   | `currentSan`       |
| 布林值     | is／has 開頭             | `isHidden`         |
| 常數       | 全大寫加底線             | `MAX_DICE`         |
| 型別       | 大駝峰                   | `Character`        |
| CSS 變數   | `--類別-名稱`            | `--color-bg-panel` |

- 非元件的 `.ts` 檔（例如 `mock.ts`、`config.ts`）怎麼命名。【待討論】

## 5. Figma 介面及共用元件規範

- 設計數值以 `docs/design/figma/README.md` 與 `docs/spectra/changes/project-foundation/design.md` 的 Design Source 表為準。【既有】
- 顏色、字型、圓角一律使用 `client/src/styles/tokens.css` 的設計變數；lint 會擋下十六進位色碼（例如 `#fff`）。【既有】
- 需要新的顏色時，開 PR 修改 `tokens.css`，不要在自己的檔案另外定義。【既有】
- 共用元件要分享並統一使用（目前 `dev` 上還沒有共用元件）。【試行】
- 寫新元件前，先查有沒有現成的共用元件。【試行】
- 共用元件放 `components/`？由誰維護？新增前先在 DC 說一聲並開 PR？【待確認】

## 6. Git 分支命名與合併規範

- 分支命名：`feature/功能-名字`。功能用英文小寫加連字號，名字用自己的暱稱（保留大小寫），例如 `feature/top-nav-Ling`。【試行】
- 功能分支一律開 PR 合併進 `dev`，不能直接 push 到 `dev` 或 `main`。【既有】
- `dev` 什麼時候、由誰合併進 `main`。【待討論】
- 發 PR 前先同步 `dev`，並確認 `npm run build` 能過。【試行】
- 至少一位組員看過才合併；PR 描述寫 `Closes #票號`。【試行】
- 做一小段就發 PR，不要累積一週。【試行】
- Commit 格式：`類型(範圍): 描述`，類型用英文、描述可以寫中文，例如 `feat(lobby): 新增房間列表`。PR 標題也用同樣格式。【試行】
- 多人做同一頁時怎麼分工、怎麼避免改到同一個檔案。【待討論】

## 7. AI 修改限制【試行】

AI 必須遵守：

1. 只能改這張票列出的檔案。
2. 改共用型別（`shared/`）、共用元件、設計變數（`tokens.css`）、設定檔之前，要先問人。設定檔包含 `package.json`、`eslint.config.js`、`.stylelintrc.json`、`.prettierrc.json`、`tsconfig*.json`、`vite.config.ts`。
3. 不能自己安裝套件、刪除檔案、搬動資料夾。
4. 不能自己 push、合併 PR、修改 Issue。
5. 不能為了讓測試通過，刪掉或改弱測試。
6. 交出前 `npm run build` 和 `npm run lint` 都要通過。
7. 遇到【待確認】或【待討論】的項目，先停下來問人。

## 8. AI 與 Spectra 開發流程

- 規格書一律用 Spectra 格式。【試行】
- 寫程式時要不要用 Spectra 指令，可以自己選。【試行】
- 使用 Spectra 時的流程：【既有】

  ```
  討論（可省略）→ 提案 → 實作 ⇄ 更新需求 → 驗證 → 封存
  /spectra-discuss → /spectra-propose → /spectra-apply ⇄ /spectra-ingest → /spectra-verify → /spectra-archive
  ```

- 規格放在 `docs/spectra/`。目前在專案根目錄執行 `spectra` 讀不到這些規格，Spectra 指令也還沒放進 repo；要怎麼設定和安裝。【待確認】
- 需求改了，先更新規格，再繼續寫程式。【既有】
- 每次只做一個小任務，做完回報再做下一個。【試行】

## 9. 功能測試規範

- 有邏輯的部分（擲骰、規則計算、權限、後端 API）用 TDD：先寫一個會失敗的測試，再寫程式讓它通過；純畫面手動對照 Figma。【待確認】
- 擲骰、權限過濾、同步衝突一定要有自動化測試。【既有】
- 擲骰測試用固定種子；正式環境不能用固定種子。【既有】
- 每合併一到兩頁，在週會撥 30 分鐘一起測；發現的 bug 開成 Issue 並貼上 `bug` 標籤。【試行】
- 測試工具（例如 Vitest、supertest）；目前專案還沒有測試工具，#8 房號檢查需要單元測試。【待討論】

## 10. 開發文件維護規範

- 完成或修改功能後，要更新相關的開發文件。【既有】
- 在 PR 描述裡寫「更新了哪些文件」，沒有就寫「無」。【試行】
- 規格要修改，透過 Spectra change 進行，不能直接改已封存的規格（目前還沒有已封存的規格）。【既有】
- 開發注意事項過時，要開新的 change 修改，不能直接忽略。【既有】
- 「相關文件」包含哪些（README、規格、API 說明……）；目前 repo 有 `README.md`、`docs/guidelines/`、`docs/planning/`、`docs/design/figma/README.md`、`docs/spectra/`。【待討論】
