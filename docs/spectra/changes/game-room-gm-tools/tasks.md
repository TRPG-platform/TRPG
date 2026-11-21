## 1. 前端票（先用假資料）

- [ ] 1.1 照 p1_TV-10.png 與 p1_TV-11.png 做 Role-based game room layout 三欄版面，預留聊天區與擲骰面板位置；驗證：GM 與玩家各開一次，左右欄內容符合規格兩個情境
- [ ] 1.2 做場景區與素材庫（背景／立繪／道具分頁、上傳按鈕依「禁止PL上傳素材」顯示），GM 選背景切換場景；驗證：假資料下 GM 切換到「夜晚的圖書館」，場景區顯示「場景：夜晚的圖書館」 [after: 1.1]
- [ ] 1.3 做 Own character panel（摘要、五個摺疊區、技能（N））、GM player menu（查看角色卡並用 −/+ 調整數值、要求技能檢定、理智檢定）與 View other players' summary；驗證：假資料下技能（5）情境正確、GM 選單有三個選項、玩家點別人只看到摘要 [after: 1.1]
- [ ] 1.4 做備忘錄目前線索（GM 新增、編輯、排序、刪除）與 In-game settings panel（使用規則唯讀、四個開關）；驗證：假資料下 GM 新增線索出現在最下方、玩家視角唯讀 [after: 1.1]
- [ ] 1.5 依「特效以開場 SAN 為基準」與「特效圖層不擋操作」做 Sanity-based screen effects、GM effects switch、Reduced motion and readability；驗證：單元測試 effect levels 範例表五列，手動確認閃爍時仍可輸入聊天、系統開啟減少動態時只剩暗角 [after: 1.3, 1.4]

## 2. 後端票

- [ ] 2.1 依「素材存在伺服器本機資料夾」實作 Asset library 與 Who can upload and delete：上傳（格式、5 MB、每房合計 40 個）、列表、刪除、只給成員讀檔，玩家受「禁止PL上傳素材」限制；驗證：測試 uploads 範例表四列、非成員讀檔 403、設定開啟時玩家上傳被拒
- [ ] 2.2 依「GM 引導視角等於伺服器保存的場景狀態」實作 Switch the scene 的 `scene.set`；驗證：測試玩家送請求被拒、重連拿到目前場景 [after: 2.1]
- [ ] 2.3 實作 GM adjusts player stats 的 `character.adjust`（依 percentile-rules 上下限截斷、只有 GM 可調別人）；驗證：測試 HP 輸入 15、上限 11 時存成 11，玩家調別人被拒
- [ ] 2.4 實作 Shared clue memo（新增、編輯、排序、刪除，每則 200 字、每房 50 則，只有 GM 可改）；驗證：測試 GM 新增後廣播、玩家修改被拒、第 51 則被拒
- [ ] 2.5 依「設定面板與房間大廳共用同一份設定」在 `Room.settings` 加入 `effects`（預設 true），遊戲開始後規則唯讀；驗證：測試遊戲中改規則被拒、改開關會廣播 `settings.updated`

## 3. 串接票

- [ ] 3.1 場景區與素材庫改接 API 與 `scene.updated` 事件；驗證：三個瀏覽器手動走過 Guided scene change [after: 1.2, 2.2]
- [ ] 3.2 角色面板、GM 玩家選單、備忘錄、設定面板改接即時事件；依「玩家列表選單是發起檢定的入口」把要求檢定與理智檢定接到 dice-and-checks 的事件；驗證：GM 調 SAN 後玩家面板 2 秒內更新、GM 新增線索時兩位玩家即時看到 [after: 1.3, 1.4, 2.3, 2.4, 2.5]

## 4. 延後候選（待問卷 Q3-C，若延後就在 12/24 之後做）

- [ ] 4.1 實作 Show and hide portraits and props（前後端）：`scene.showAsset`、`scene.hideAsset`，立繪最多 3 張、道具 1 個；驗證：測試第四張立繪取代最舊的，三個瀏覽器手動走過 Show an NPC portrait [after: 3.1]


