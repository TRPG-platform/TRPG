## 1. 前端票（先用假資料）

- [ ] 1.1 依「採用 TV-7 排版」照 p1_TV-07.png 做劇本庫頁：搜尋框、Script list with status filter 的狀態 chip（附數量）與共用劇本 chip、規則與標籤下拉（Search and filter scripts）、卡片／清單切換、Pagination 每頁 4 個；驗證：假資料 10 個劇本時有 3 頁（4、4、2），切換清單檢視時篩選保留
- [ ] 1.2 做 Script detail dialog：點卡片彈出詳細資訊（照 p1_detail-panel.png），時間格式 YYYY-MM-DD HH:mm，換篩選時關閉並清除選取；驗證：點「夜行的圖書館」顯示 最後編輯 2026-11-17 14:28，切到「草稿」後沒有選取 [after: 1.1]
- [ ] 1.3 做 Delete and favorite 的前端：星號收藏切換、⋯ 選單刪除確認與使用中被拒訊息；驗證：假資料下手動走過收藏與 Delete blocked by an active room 情境 [after: 1.1]
- [ ] 1.4 依「建立與編輯表單等設計圖」做 Create and edit a script 表單（含預計時長、公開分享開關、form errors 範例表的訊息）；設計圖預計 12/4 交；驗證：手動走過 form errors 範例表四列 [after: 1.2]

## 2. 後端票

- [ ] 2.1 建立劇本資料表與 `GET /api/scripts`，依「篩選在伺服器端做」實作狀態數量、搜尋、篩選與分頁（每頁 4 個、收藏優先、再依最後編輯新到舊）；驗證：單元測試涵蓋 combined filters 範例表三列、page split 範例與「換篩選回第 1 頁」
- [ ] 2.2 實作建立／修改劇本 API 與封面上傳（JPG／PNG、5 MB 上限），新劇本預設草稿；驗證：測試 form errors 範例表四列都回 400 且資料未變 [after: 2.1]
- [ ] 2.3 實作刪除與收藏 API：有 waiting／playing 房間使用中時刪除回 409，收藏只影響自己；驗證：測試使用中刪除被拒、兩個使用者的收藏互不影響 [after: 2.1]

## 3. 串接票

- [ ] 3.1 列表、詳細資訊、收藏、刪除改接 API；驗證：`VITE_DATA_SOURCE=api` 時手動走過 1.1～1.3 的驗證項目 [after: 1.2, 1.3, 2.3]
- [ ] 3.2 建立／編輯表單改接 API（含封面上傳）；驗證：`VITE_DATA_SOURCE=api` 時建立一個劇本後出現在第 1 頁 [after: 1.4, 2.2, 3.1]

## 4. 延後候選（待問卷 Q3，若延後就在 12/24 之後做）

- [ ] 4.1 依「匯出檔用 zip」做 Import and export a script file（前後端）：⋯ 選單匯出、建立新劇本旁的匯入按鈕；驗證：測試匯出再匯入後欄位相同、匯入 PNG 顯示「檔案格式不正確」且劇本數不變 [after: 3.2]
- [ ] 4.2 依「分享用複製而非共同編輯」做 Share and copy scripts（前後端）：共用劇本 chip 的列表、`GET /api/scripts/shared`、`POST /api/scripts/:id/copy`；驗證：用兩個帳號手動走過分享、複製、取消分享情境 [after: 3.2]


