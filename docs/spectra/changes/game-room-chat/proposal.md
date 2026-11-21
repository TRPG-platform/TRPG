## Why

文字團的遊戲幾乎都在聊天裡進行：GM 描述場景、玩家說話與行動、私下密談。分工表把公開聊天、私密訊息、訊息編輯／刪除、查看 GM 公告列為第一階段 ⭐ 功能；設計稿 TV-10、TV-11 中間下方是聊天區（主要頻道／Dice／GM公告三個分頁）。

## What Changes

- 新增遊戲房間的聊天區：主要頻道、Dice、GM公告三個分頁，訊息即時出現在所有成員畫面上。
- 新增密語：可選擇傳給所有人或指定成員，依房間設定開放 GM→玩家、玩家→玩家密語。密語對象用輸入框旁的下拉選單選。
- 新增圖片訊息：輸入列左側＋按鈕傳圖片（JPG／PNG／WebP、≤5MB）。是否延到 12/24 之後由組員問卷 Q3 決定。
- 新增編輯與刪除自己的訊息；GM 可刪除任何訊息。
- 訊息存進資料庫，重新進房能看到歷史訊息（之後的遊玩紀錄也依賴這些資料）。
- GM公告分頁顯示 room-lobby 的公告，GM 在遊戲中也能更新。

## Capabilities

### New Capabilities

- `room-chat`: 遊戲房間的聊天頻道、密語、訊息編輯刪除、歷史訊息、GM 公告分頁。

### Modified Capabilities

(none)

## Impact

- Affected specs: room-chat（新增）
- Affected code:
  - New: 前端遊戲房間聊天區元件（分頁、訊息列表、輸入列、密語對象選擇）
  - New: 後端訊息資料表、訊息 API 與即時事件
- Dependencies: project-foundation（Message 型別）、room-lobby（room-realtime 連線、房間設定、GM 公告資料）。dice-and-checks 會把擲骰結果寫成 Dice 分頁的訊息。


