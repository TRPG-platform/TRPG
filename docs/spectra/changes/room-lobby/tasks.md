## 1. 前端票（先用假資料）

- [ ] 1.1 依「建立房間用彈出視窗」做 Create a room 的彈出視窗：選劇本、人數上限、開團時間、公開與否，沒有劇本時顯示提示；驗證：假資料下建立房間後進到大廳，沒有劇本的帳號看到「你還沒有劇本」
- [ ] 1.2 依「以 TV-5／TV-6 為準」做 Lobby overview 與 Room code and invite link：劇本資訊（含預計時長）、成員列表（標籤、在線、已準備）、底部已準備數、房號與邀請連結複製；驗證：比對 p1_TV-05.png、p1_TV-06.png，Ready count 情境數字正確
- [ ] 1.3 做 Choose a character for this game 與 Ready state 的畫面：角色庫／我的角色分頁、建立新角色、準備按鈕停用規則、換角色重置準備；驗證：假資料下手動走過四個情境 [after: 1.2]
- [ ] 1.4 做 GM game settings（規則下拉選單 CoC 7e／6e／5e、四個開關）與 GM announcement 編輯畫面；驗證：比對 p1_TV-06.png，玩家視角看不到設定面板 [after: 1.2]
- [ ] 1.5 做 Start the game 與 Leave the lobby 的畫面：開始跑團按鈕條件、預覽／編輯劇本／素材管理導向、玩家離開、GM 解散房間確認；驗證：假資料下手動走過四個情境 [after: 1.3, 1.4]

## 2. 後端票

- [ ] 2.1 依「先試做即時連線」做最小 Socket.IO 範例：兩個瀏覽器在同一個房間互傳一則訊息，並把做法寫成給組員的筆記；驗證：兩個瀏覽器手動測試，A 送出後 B 在 2 秒內收到
- [ ] 2.2 依「Socket.IO 一房一頻道」做 Room-scoped live connection：握手驗證登入與成員身分、事件只送同房；驗證：測試非成員連線被拒、A 房事件不會送到 B 房 [after: 2.1]
- [ ] 2.3 依「房間狀態版本號」做 Server-authoritative state with versions 與 `GET /api/rooms/:id/state`；驗證：測試版本號每次 +1、玩家改 GM 設定被拒且版本不變 [after: 2.2]
- [ ] 2.4 依「離線判定延遲 10 秒」做 Online presence and reconnection 的伺服器端：斷線 10 秒後才廣播離線；驗證：測試斷線 5 秒重連不廣播離線、10 秒後廣播 [after: 2.3]
- [ ] 2.5 做房間 API：`POST /api/rooms`（唯一房號、建立者為 GM）、`POST /api/rooms/:id/leave`、`POST /api/rooms/:id/disband`；驗證：API 測試房號不重複、離開會釋出名額、解散後狀態為 ended

## 3. 串接票

- [ ] 3.1 建立房間與大廳改接 API 與即時事件（成員加入離開、在線狀態），前端跳號時自動補完整狀態、斷線顯示「重新連線中…」；驗證：兩個瀏覽器手動測試加入、離開、斷網 10 秒 [after: 1.2, 2.4, 2.5]
- [ ] 3.2 選角色、準備、設定、公告、開始跑團、離開與解散改接即時事件；驗證：三個瀏覽器手動走過 Ready state、GM announcement、Start the game、Leave the lobby 的情境 [after: 1.5, 3.1]


