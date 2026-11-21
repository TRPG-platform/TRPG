## Context

房間大廳有兩版設計：Page 1 的 TV-5（玩家）、TV-6（GM），以及「TRPG 房間大廳」頁的舊版（品牌名 TRPG Hub、用「KP」）。這是第一個需要即時同步的功能，docs/guidelines/trpg-web-development.md 第 5、6 節要求伺服器權威、版本號、斷線補狀態、伺服器端權限檢查。

## Design Source

- 來源：Figma `x6ouzHCErrn0wFEuoL5nBD`
- 快照：docs/design/figma/frames/p1_TV-05.png（玩家）、p1_TV-06.png（GM）、lobby_room-hall.png（舊版，僅參考）
- 元件：p1_x_16_Component3.png（我的角色分頁 4 種角色、角色庫列表含 HP／SAN）、p1_x_17_Button.png（玩家未準備／準備完成）、p1_x_23_Component16.png（開關 開／關）、p1_x_30_Component28.png（規則下拉選單收合／展開，選項 Coc 7e／6e／5e）

| 項目 | 值 |
|---|---|
| 頁面標題「房間大廳」 | Noto Serif TC 700，金色 `#E8D1A5` |
| 面板 | 背景 `#2B2232`，圓角 8–12px |
| 玩家列 | 頭像 56px 圓形、GM 標籤金色、PL 標籤紫色 `#9972AD`、在線綠點、「已準備」綠字 |
| GM 公告欄 | 外框 `#51405C`，圓角 12px，標題前閃電圖示 |
| 底部狀態列 | 高約 80px，左側星形圖示；準備按鈕紫 `#9566C2`，約 224×54px |
| GM 工具按鈕 | 淺紫框 `#C4A0D3`，開始跑團實心紫 |
| 權限開關 | 紫色 toggle |

## Goals / Non-Goals

**Goals:**

- 建立房間、大廳兩種視角、角色選擇、準備、設定、公告、開始跑團。
- 建立所有房間功能共用的即時連線。

**Non-Goals:**

- 踢出玩家、轉移 GM、觀戰者。
- 遊戲房間內的畫面（game-room-chat、game-room-gm-tools 負責）。

## Decisions

### 以 TV-5／TV-6 為準

採用 Page 1 新版（Takoyaki 品牌、GM 用詞）。舊版的「預計時長」「尚有 1 個名額」等資訊併入新版左欄與玩家列表。

### Socket.IO 一房一頻道

每個房間對應一個 Socket.IO room，連線握手時用登入 cookie 驗證身分並檢查是否為成員。事件格式統一為 `{ type, version, payload }`。這條連線放在本規格建立，後續三份房間規格沿用，不各自開連線。

### 房間狀態版本號

伺服器為每個房間維護遞增版本號，每次成功變更 +1 後廣播。前端發現跳號或重連時呼叫 `GET /api/rooms/:id/state` 取完整狀態。依 guidelines 第 5 節做法。

### 離線判定延遲 10 秒

連線中斷 10 秒後才廣播離線，避免網路短暫抖動讓在線燈一直閃。

### 建立房間用彈出視窗

首頁「建立房間」開啟彈出視窗表單（選劇本、人數、時間、公開），送出後直接進大廳。設計稿沒有這個畫面，沿用登入卡片的表單樣式。

### 先試做即時連線

Socket.IO 課程沒教（2026-11-21 確認課表）。11/30 先開一張試做任務：兩個瀏覽器在同一房間互傳訊息，並寫成組員筆記。之後的即時連線、聊天、擲骰廣播都照這份筆記做，避免每個人各自摸索。

## Implementation Contract

- **行為**：如兩份規格所述。
- **API**：`POST /api/rooms`、`GET /api/rooms/:id/state`、`POST /api/rooms/:id/leave`、`POST /api/rooms/:id/disband`；即時事件 `member.joined`、`member.left`、`member.presence`、`member.character`、`member.ready`、`settings.updated`、`announcement.updated`、`room.started`、`room.ended`。
- **失敗模式**：非成員連線被拒；權限不足的請求回錯誤事件 `{ type: "error", code: "forbidden" }` 且不廣播；開始跑團條件不符回 `not-ready`。
- **驗收**：用兩個瀏覽器（GM、玩家）手動走過每個情境；後端測試權限檢查與版本號遞增、跳號補狀態。
- **範圍內**：建立房間、大廳兩視角、即時連線基礎。
- **範圍外**：踢人、轉移 GM、觀戰、遊戲房間畫面。

## Risks / Trade-offs

- [即時連線是後續三份規格的基礎，延誤會連帶卡住] → 本規格任務 1.x 先做，12/16 前至少完成連線與成員事件。
- [多人同時按準備或改設定] → 伺服器依收到順序處理，版本號保證所有人最終一致。

## Open Questions

無。2026-11-21 已決定：

- 規則下拉選單照設計稿顯示 CoC 7e／6e／5e。
- 預計時長存在劇本（在 script-library 的表單填寫），房間大廳顯示；劇本沒填就不顯示。


