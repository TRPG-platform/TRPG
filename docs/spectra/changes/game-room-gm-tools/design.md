## Context

遊戲房間（TV-10 GM 視角、TV-11 玩家視角）中，聊天區由 game-room-chat 負責、擲骰面板由 dice-and-checks 負責，其餘版面與面板都在本規格。即時同步沿用 room-lobby 的 room-realtime。docs/guidelines/trpg-web-development.md 第 6 節要求權限在伺服器端檢查，第 11 節要求注意無障礙（閃爍特效）。

## Design Source

- 來源：Figma `x6ouzHCErrn0wFEuoL5nBD`，快照 docs/design/figma/frames/p1_TV-10.png（GM）、p1_TV-11.png（玩家）
- 元件：p1_x_23_Component16.png（開關 開／關）、p1_x_30_Component28.png（規則下拉選單）

| 項目 | 值 |
|---|---|
| 畫面 | 1306×720，三欄：左欄約 280px、中欄約 700px、右欄約 250px |
| 場景區 | 中欄上方約 700×320px，左上角標籤「場景：…」 |
| 面板 | 背景 `#2B2232`，邊框 `#51405C`，圓角 4px；面板標題列 `#40313B` |
| 玩家列 | 方形頭像 68px、PL 紫色標籤、名稱粗體、職業小字 |
| 角色面板摺疊區 | 標題列 `#40313B`，右側 ⌃／⌄ 圖示 |
| 素材分頁 | 背景／立繪／道具，縮圖 2 欄，圓角 4px |
| 開關 | 紫色 toggle（Component 16） |

## Goals / Non-Goals

**Goals:**

- 遊戲房間版面、素材庫、GM 引導視角、角色面板、GM 調整數值、線索備忘錄、氣氛特效。

**Non-Goals:**

- 地圖格線、棋子移動、戰爭迷霧（分工表「盤面操作」不是 ⭐）。
- 音效與背景音樂。
- 結束遊戲與結算頁（另開規格書）。

## Decisions

### GM 引導視角等於伺服器保存的場景狀態

房間狀態多一個 `scene`：`{ backgroundAssetId, caption, shownPortraits: [assetId], shownProp: assetId | null }`。GM 每次切換都更新它並廣播；玩家畫面只依這份狀態顯示，所以晚到或重連的人也看得到目前場景。

### 素材存在伺服器本機資料夾

第一階段把上傳檔存在後端的上傳資料夾，檔名用隨機 id，透過 `GET /api/rooms/:id/assets/:assetId/file` 讀取並檢查成員身分。部署主機確定後若改用雲端儲存，只換儲存層。script-library 的封面也沿用這個儲存方式。

### 特效以開場 SAN 為基準

比例 = 目前 SAN ÷ 進入遊戲時的 SAN（房間開始時記錄在成員資料裡）。≤ 50% 顯示暗角，≤ 20% 加上每 8 秒一次、長 300ms 的閃爍。特效只在該玩家自己的瀏覽器計算與顯示，不廣播給別人。

### 特效圖層不擋操作

特效是一層 `pointer-events: none` 的全畫面圖層，放在場景區與面板之上、但在輸入框與按鈕之下；系統要求減少動態時只保留暗角。

### 設定面板與房間大廳共用同一份設定

遊戲中的開關與 room-lobby 的跑團設定讀寫同一個 `Room.settings`，新增 `effects`（預設 true）。

### 玩家列表選單是發起檢定的入口

2026-11-21 決定：擲骰面板不分頁，GM 改從左側玩家列表點某位玩家，在選單中選「查看角色卡」「要求技能檢定」「理智檢定」。選單屬於本規格，檢定流程由 dice-and-checks 負責。玩家點別人只看摘要。

## Implementation Contract

- **行為**：如三份規格所述。
- **API／事件**：`POST /api/rooms/:id/assets`（multipart，含 category）、`DELETE /api/rooms/:id/assets/:assetId`、`GET /api/rooms/:id/assets`、`GET /api/rooms/:id/assets/:assetId/file`；即時請求 `scene.set`、`scene.showAsset`、`scene.hideAsset`、`character.adjust { characterId, field, value }`、`clue.add|edit|move|remove`、`settings.update`；廣播 `scene.updated`、`character.status`、`clues.updated`、`settings.updated`。
- **失敗模式**：上傳不符規則回 400 並附 Example 表訊息；玩家送 GM 限定請求回 forbidden 且不廣播；非成員讀素材回 403。
- **驗收**：三份規格的 Example 表寫成測試（上傳規則、特效等級函式）；GM 與兩位玩家三個瀏覽器手動走過場景切換、立繪展示、數值調整、線索、特效開關。
- **範圍內**：遊戲房間版面（不含聊天區與擲骰面板的內容）、上列功能。
- **範圍外**：上列 Non-Goals、聊天區、擲骰面板。

## Risks / Trade-offs

- [閃爍可能讓部分玩家不適] → 有減少動態偵測，GM 可關閉，並在新手教學提醒。
- [上傳空間無限成長] → 每房合計 40 個、每張 5 MB 上限；房間結束後的清理另開規格書。
- [版面三欄在 1280px 以下擠壓] → 第一階段只支援 1280px 以上寬度。

## Open Questions

- 待問卷 Q2：每房最多 40 個素材，是三類加起來（本規格暫採推薦 A）、只限立繪，還是各自 40 個。
- 待問卷 Q3-C：在場景上展示立繪與道具是否延到 12/24 之後（任務第 4 組）。
- 2026-11-21 已決定：玩家點別人只看摘要；特效門檻為開場 SAN 的 50%（變暗）與 20%（閃爍）。


