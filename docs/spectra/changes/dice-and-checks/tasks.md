## 1. 共用計算票（純函式，放共用資料夾，前後端都用）

- [ ] 1.1 依「判定與算式解析放在共用資料夾」實作 Dice expression syntax 解析器（NdM 一次最多 50 顆、khK／klK、常數、加減、上限）；驗證：單元測試涵蓋 expressions 範例表八列
- [ ] 1.2 依「規則模組回傳通用等級」實作 Skill check success levels 與 Bonus and penalty dice 的判定函式（輸入骰子點數，輸出等級與顯示文字）；驗證：單元測試涵蓋 skill check results 範例表與兩個獎懲骰情境
- [ ] 1.3 實作 Sanity check 的結算函式（輸入目前 SAN、損失算式與點數，輸出新 SAN 與提示）；驗證：單元測試涵蓋 sanity checks 範例表四列 [after: 1.1]

## 2. 前端票（先用假資料）

- [ ] 2.1 依「擲骰面板不分頁」照 p1_TV-11.png 做 Skill check panel：技能下拉（顯示最終值）、獎懲骰、明暗骰、進行判定、算式框＋擲骰、擲骰紀錄綠紅標籤；假資料層用 1.1／1.2 的函式模擬擲骰；驗證：假資料下顯示 1D100 ≦ 75 → 34 綠色成功，自由擲骰 1d8+1 出現在擲骰紀錄 [after: 1.1, 1.2]
- [ ] 2.2 做玩家收到「請進行 聆聽 檢定」「請進行理智檢定」提示的畫面（GM 的發起入口在 game-room-gm-tools 的玩家列表選單）；驗證：假資料下模擬 GM 要求，玩家畫面出現提示並能按擲骰 [after: 2.1, 1.3]

## 3. 後端票

- [ ] 3.1 依「安全亂數可注入」實作 Server-side rolling：正式用 `crypto.randomInt`、測試注入固定種子、正式模式有種子設定時拒絕啟動；驗證：測試同種子兩次結果相同、正式模式加種子啟動失敗 [after: 1.1]
- [ ] 3.2 依「擲骰結果以聊天訊息傳遞」實作 Roll record 與 Open and hidden rolls：存擲骰紀錄、建立 dice 訊息、暗骰只送擲骰者與 GM；驗證：測試玩家收到的暗骰事件裡沒有算式與點數 [after: 3.1]
- [ ] 3.3 實作檢定請求並落實 Check visibility and authority：使用伺服器存的角色數值、玩家只能檢定自己的角色、理智檢定只有 GM 能發起；驗證：測試偽造目標值 99 時以 75 判定、玩家發起理智檢定被拒 [after: 3.2, 1.2, 1.3]

## 4. 串接票

- [ ] 4.1 擲骰面板、GM 要求檢定、理智檢定提示改接即時事件，SAN 更新後角色面板同步；驗證：兩個瀏覽器手動走過 Design sample record、GM requests a check、sanity checks 範例表第一列與暗骰 [after: 2.2, 3.3]


