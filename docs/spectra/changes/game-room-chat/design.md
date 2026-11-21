## Context

聊天區位於遊戲房間畫面中間下方，上方是場景圖（game-room-gm-tools 負責）。即時連線沿用 room-lobby 的 room-realtime。docs/guidelines/trpg-web-development.md 第 6 節要求密語在伺服器端過濾、第 8 節要求防 XSS 與保存紀錄。

## Design Source

- 來源：Figma `x6ouzHCErrn0wFEuoL5nBD`，快照 docs/design/figma/frames/p1_TV-10.png（GM 視角）、p1_TV-11.png（玩家視角）

| 項目 | 值 |
|---|---|
| 分頁 | 選取：紫底 `#9972AD` 白字；未選：深底 `#211B23`、邊框 `#51405C` |
| 訊息列 | 頭像 40px 圓形；GM 標籤金色 `#E8D1A5`、PL 標籤紫色；名稱粗體 13px；內文 Noto Sans TC 12–13px |
| 輸入列 | 左側＋按鈕、輸入框背景 `#40313B` 圓角 4px、右側紫色送出按鈕（紙飛機圖示） |

## Goals / Non-Goals

**Goals:**

- 三個分頁、公開訊息、密語、編輯刪除、歷史訊息、公告分頁、圖片訊息。

**Non-Goals:**

- 圖片以外的檔案訊息、表情符號回應、訊息搜尋、匯出團錄（遊戲結束頁另開規格書）。

## Decisions

### ＋按鈕傳圖片、密語對象用下拉選單

**Supersedes**: game-room-chat / 輸入列左側＋按鈕開啟密語對象選擇

2026-11-21 決定：輸入列左側的＋按鈕用來傳圖片（只收 JPG／PNG／WebP、每張 ≤5MB），檔案沿用 game-room-gm-tools 的素材儲存方式。密語對象改成輸入框與送出鍵之間的「傳送給」下拉選單，預設「所有人」。圖片訊息可能延到 12/24 之後（待問卷 Q3-B），所以放在任務第 4 組。

### 密語在伺服器端過濾

伺服器廣播訊息時逐一檢查接收者是否可見，不可見者完全不送。前端不負責隱藏。

### GM 看得到所有密語

TRPG 慣例中 GM 需要掌握玩家間的私下交流，所以玩家互相密語時 GM 也看得到，並在密語標籤上標示。

### 訊息只存純文字

伺服器只存原始文字，前端一律以純文字顯示，不轉 HTML、不支援 Markdown，避免 XSS。

### 刪除用軟刪除

刪除只把 `deleted` 設為 true 並清空內文，保留時間與發送者，讓遊玩紀錄的順序不亂。

## Implementation Contract

- **行為**：如規格所述。
- **API／事件**：`GET /api/rooms/:id/messages?before=<messageId>&limit=50`；即時請求 `message.send { body, recipientId?, imageId? }`（圖片先以 `POST /api/rooms/:id/chat-images` 上傳取得 imageId）、`message.edit { id, body }`、`message.delete { id }`；廣播 `message.created`、`message.updated`、`message.deleted`（依可見性逐人送出）。
- **失敗模式**：超過 1000 字、空白、不允許的密語、編輯別人或擲骰訊息 → 錯誤事件 `{ type: "error", code }`，畫面保留輸入。
- **驗收**：三個瀏覽器（GM、兩位玩家）手動走過每個情境；後端測試密語可見性矩陣與 message input 範例表。
- **範圍內**：聊天區元件、訊息 API 與事件、密語過濾、公告分頁、圖片訊息。
- **範圍外**：擲骰訊息的產生（dice-and-checks）、場景圖、團錄匯出。

## Risks / Trade-offs

- [訊息量大時資料庫成長] → 只分頁讀取，每次 50 筆。
- [洗版] → 每人每秒最多 3 則，超過回錯誤「發言太快了」。

## Open Questions

- 待問卷 Q3-B：聊天傳圖片是否延到 12/24 之後。
- 2026-11-21 已決定：＋按鈕傳圖片；GM 看得到玩家間密語。


