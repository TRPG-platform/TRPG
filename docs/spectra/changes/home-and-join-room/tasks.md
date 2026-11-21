## 1. 前端票（先用假資料）

- [ ] 1.1 照 p1_TV-02.png 做首頁的 Hero and entry buttons：標語、副標、建立房間、搜尋團務；依「搜尋團務先導向加入房間頁」設定導向，未登入先導向登入頁；驗證：手動測試已登入與未登入各點兩顆按鈕
- [ ] 1.2 用假資料做 Upcoming recruiting games 卡片列：最多 4 張、依開團時間排序、沒有資料時顯示提示與建立房間按鈕，點卡片走加入流程；驗證：比對 p1_TV-02.png，假資料放 5 個房間時只顯示最早的 4 個，清空假資料時出現提示 [after: 1.1]
- [ ] 1.3 照 p1_TV-03.png 用假資料做加入房間頁的 Join by room code：輸入自動轉大寫、未滿 6 碼按鈕停用、拒絕時保留房號並顯示四種訊息；驗證：手動走過規格三個情境與拒絕原因表
- [ ] 1.4 做 Join by invite link 路由 `/join/<roomCode>`，未登入先登入後自動加入；驗證：假資料下登出狀態開 `/join/A7F3K9`，登入後直接進到房間 [after: 1.3]

## 2. 後端票

- [ ] 2.1 實作 `GET /api/rooms/recruiting`，依「近期開團只顯示公開房間」篩選（公開、waiting、開團時間在未來），依開團時間排序、最多 4 筆；驗證：單元測試用規格 sort order 範例的三個房間，回傳順序為 霧都。追跡。、洋詭異人館、失落的文明
- [ ] 2.2 實作 `POST /api/rooms/join`，依「加入在伺服器端檢查」處理 Join refusals 與 Rejoin an already joined room：同一交易內檢查並新增成員；驗證：單元測試涵蓋拒絕原因表四列、重複加入不新增成員、兩個請求同時搶最後一席只有一個成功

## 3. 串接票

- [ ] 3.1 首頁近期開團改接 `GET /api/rooms/recruiting`；驗證：`VITE_DATA_SOURCE=api` 時卡片來自後端，後端沒有房間時顯示提示 [after: 1.2, 2.1]
- [ ] 3.2 加入房間頁與邀請連結改接 `POST /api/rooms/join`，成功後依回傳導向大廳或遊戲房間；驗證：`VITE_DATA_SOURCE=api` 時手動走過拒絕原因表與重複加入情境 [after: 1.4, 2.2]


