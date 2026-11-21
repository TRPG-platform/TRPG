## Context

設計稿有兩版劇本庫：Page 1 的 TV-7（一排 4 張、無側欄、無右側面板）與「TRPG 房間大廳」頁的劇本庫管理（左側欄＋右側詳細面板）。2026-11-21 組員決定劇本庫每頁 4 個、排成一排，也就是照 TV-7。原本放在側欄與右側面板的功能要換位置，具體放法等組員問卷 Q1，本規格先採推薦選項 A。

## Design Source

- 來源：Figma `x6ouzHCErrn0wFEuoL5nBD`
- 主要畫面：docs/design/figma/frames/p1_TV-07.png（版面）、p1_detail-panel.png（詳細資訊內容，改做成彈出視窗）
- 互動狀態參考：lobby_x_31（卡片一般／滑過／選取三態）、lobby_x_33（清單列）、lobby_x_39（清單檢視）、lobby_x_40～42（分類篩選）
- 檔案資料：docs/design/figma/file.json 內 node 184:170（Script Card 元件組）、184:140（Status Badge）

| 項目 | 值 |
|---|---|
| 卡片 | 約 205×185px（TV-7 一排 4 張），背景 `#2B2232`，邊框 `#51405C`，圓角 12px；選取時邊框淺紫 `#C4A0D3` |
| 狀態標籤 | 進行中：紫 `#9972AD`；草稿：灰褐 `#756E60`；已完成：綠 `#43866B` |
| 分類標籤（chip） | 選取：紫底 `#9972AD`；未選：深底加 `#51405C` 邊框，圓角 8px |
| 建立新劇本按鈕 | 紫 `#9972AD`，圓角 8px，左側＋圖示 |
| 詳細資訊視窗 | 寬 360px（沿用 Detail Panel），標題 Noto Serif TC 700 金色 `#E8D1A5` |
| 文字樣式 | Script Library / Card title、Body、Small、Label（file.json styles） |
| 圖示 | Icon / grid、list、search、star、more、edit、clock、plus、upload |

## Goals / Non-Goals

**Goals:**

- 劇本基本資料的完整管理、篩選、分頁、詳細資訊。
- 匯入匯出與分享複製（是否延到 12/24 之後由問卷 Q3 決定）。

**Non-Goals:**

- 劇本內容編輯器（場景、NPC、線索），設計稿標為「導向預留」，另開規格書。
- 範本中心、雲端空間用量。

## Decisions

### 採用 TV-7 排版

**Supersedes**: script-library / 採用有側欄的版本

2026-11-21 決定每頁 4 個、排成一排，照 TV-7。TV-7 沒有側欄與右側面板，所以暫採問卷 Q1 的推薦選項 A：「共用劇本」改成分類 chip 旁的一個 chip、「匯入劇本」放在「建立新劇本」旁、詳細資訊改成點卡片彈出視窗。若問卷改選 B（詳細資訊獨立成一頁）或 C（回到側欄版、每頁 3 張），要改 Script detail dialog、Pagination、Share and copy scripts 三條需求。頂部導覽列一律用 project-foundation 的 Takoyaki 導覽列。

### 建立與編輯表單等設計圖

表單欄位由規格決定，外觀等設計者交圖（建議 12/4 前，2026-11-21 決定）。只有表單的前端任務等設計圖，其他任務不受影響。

### 匯出檔用 zip

匯出檔是 `.takoyaki-script.zip`，內含 `script.json`（Script 欄位，去掉 id、ownerId）與封面圖。匯入時檢查 `script.json` 的格式版本與必填欄位，不符就拒絕。

### 分享用複製而非共同編輯

其他 GM 拿到的是複本，與原作者的劇本互不影響。共同編輯需要權限與衝突處理，第一階段不做。

### 篩選在伺服器端做

`GET /api/scripts` 接受 `q`、`status`、`ruleSystem`、`tags`、`page`、`view` 參數，每頁 4 筆，回傳該頁資料與各狀態數量，避免劇本變多時一次傳全部。

## Implementation Contract

- **行為**：如規格所述的列表、篩選、分頁、詳細資訊視窗、表單、刪除、收藏、匯入匯出、共用劇本。
- **API**：`GET /api/scripts`（自己的）、`GET /api/scripts/shared`、`POST /api/scripts`、`PATCH /api/scripts/:id`、`DELETE /api/scripts/:id`（被使用中回 409）、`PUT/DELETE /api/scripts/:id/favorite`、`GET /api/scripts/:id/export`、`POST /api/scripts/import`、`POST /api/scripts/:id/copy`。只能改、刪、匯出自己的劇本，否則回 403。
- **失敗模式**：表單錯誤回 400 加欄位訊息；匯入格式錯誤回 400「檔案格式不正確」。
- **驗收**：規格每個 Example 表寫成後端測試；手動比對 p1_TV-07.png 與 p1_detail-panel.png。
- **範圍內**：上述頁面與 API、封面上傳、預計時長欄位。
- **範圍外**：劇本內容編輯器、範本中心、雲端空間、多人共同編輯、左側欄。

## Risks / Trade-offs

- [表單設計圖晚到] → 只有表單前端任務延後，列表、詳細資訊、後端任務照常進行。
- [封面圖片佔空間] → 單張 5 MB 上限；儲存位置沿用 game-room-gm-tools 的素材儲存方式。

## Open Questions

- 待問卷 Q1：共用劇本、匯入劇本、詳細資訊的位置（本規格暫採推薦 A）。
- 待問卷 Q3：匯入／匯出（A）、分享與複製（D）是否延到 12/24 之後；這兩組任務先放在任務第 4 組。


