## 1. 前端票（先用假資料）

- [ ] 1.1 照 p1_TV-11.png 做 Chat tabs 與訊息列表：三個分頁、未讀點、GM／PL 標籤、依「訊息只存純文字」以純文字顯示、Enter 送出與 Shift+Enter 換行（Send public messages 的畫面）；驗證：假資料下比對設計圖，送出 `<b>hi</b>` 顯示為原字
- [ ] 1.2 做 Whisper messages 的畫面：輸入框與送出鍵之間的「傳送給」下拉選單（預設所有人）、密語標籤，選項依房間設定顯示；驗證：假資料下切換房間設定，選單選項跟著改變 [after: 1.1]
- [ ] 1.3 做 Edit and delete messages 的畫面（訊息選單、（已編輯）、此訊息已刪除、擲骰訊息沒有編輯選項）與 Message history 往上捲動載入更早訊息；驗證：假資料 120 則時往上捲兩次看到全部 [after: 1.1]
- [ ] 1.4 做 GM announcement tab：顯示公告與更新時間，GM 可在遊戲中編輯；驗證：假資料下 GM 視角可編輯、玩家視角唯讀 [after: 1.1]

## 2. 後端票

- [ ] 2.1 建立訊息資料表，實作 `message.send`（1–1000 字、去頭尾空白、每人每秒最多 3 則）與 `message.created` 廣播；驗證：測試 message input 範例表三列與發言過快被拒
- [ ] 2.2 依「密語在伺服器端過濾」與「GM 看得到所有密語」實作密語權限與逐人廣播；驗證：測試四種組合（玩家→GM、GM→玩家、玩家→玩家各在設定開／關時），並確認不可見者收不到事件 [after: 2.1]
- [ ] 2.3 依「刪除用軟刪除」實作 `message.edit`、`message.delete`：只能改自己的、GM 可刪任何、擲骰訊息不可編輯；驗證：測試偽造編輯別人訊息與擲骰訊息都被拒 [after: 2.1]
- [ ] 2.4 實作 `GET /api/rooms/:id/messages`（每次 50 筆、依可見性過濾）；驗證：測試 120 則訊息分三次讀完，且玩家讀不到不可見的密語 [after: 2.2]

## 3. 串接票

- [ ] 3.1 聊天區改接即時事件與歷史訊息 API；驗證：三個瀏覽器（GM、兩位玩家）手動走過 Message reaches everyone、Whisper visibility、Edit own message、Reload keeps history [after: 1.2, 1.3, 2.3, 2.4]
- [ ] 3.2 GM公告分頁改接 room-lobby 的公告事件；驗證：兩個瀏覽器手動走過 Update during play 情境 [after: 1.4, 3.1]

## 4. 延後候選（待問卷 Q3-B，若延後就在 12/24 之後做）

- [ ] 4.1 依「＋按鈕傳圖片、密語對象用下拉選單」做 Image messages（前後端）：＋按鈕選圖、上傳、訊息內顯示縮圖、點擊放大、密語可帶圖；驗證：手動走過 Send an image 與 Rejected image 情境 [after: 3.1]


