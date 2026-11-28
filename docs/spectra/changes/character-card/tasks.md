## 1. 規則計算票（純函式，放共用資料夾，前後端都用）

- [ ] 1.1 依「規則資料表化」建立技能清單與職業清單資料檔（含音樂家職業公式），並遵守 Content and naming restrictions（規則名稱照設計稿顯示 CoC 7e 等，不複製規則書原文與表格）；驗證：審閱者檢查資料檔，說明文字都是團隊自己寫的
- [ ] 1.2 依「計算函式放在共用資料夾」實作 Attribute difficulty values 與 Derived status values（含 Build、Damage Bonus、MOV 表與目前值上下限）；驗證：單元測試涵蓋 attribute values、沈映月、Build and Damage Bonus、MOV 四個範例表 [after: 1.1]
- [ ] 1.3 實作 Skill point budgets 與 Skill final values（閃避基礎 = DEX/2、母語基礎 = EDU、上限 99）；驗證：單元測試涵蓋 skill rows 範例表、音樂家 290／160 點、超支被拒 [after: 1.1]

## 2. 前端票（第一階段，先用假資料）

- [ ] 2.1 照 p1_TV-09.png 做 My characters list：筆記本外觀、每頁 6 張（3 欄 × 2 列，先排左頁再排右頁，兩頁都滿才翻頁）、名字寫在照片下方、搜尋、「點此新增調查員檔案」新增並開啟編輯器；驗證：假資料下比對設計圖，搜尋「警察」只剩相符角色
- [ ] 2.2 依「採用角色數值板 8 分頁版本」與「分兩階段交付」做 Notebook editor tabs 外框（8 個側邊分頁都在，第二階段的 3 頁先顯示「即將推出」）與調查員、身分分頁；驗證：比對 char_0-overview.png、char_1-identity.png，切換分頁輸入不遺失 [after: 2.1]
- [ ] 2.3 做數值分頁（九項屬性、HP／MP／SAN／LUCK 的 −/+、體格、傷害加成、移動力、傷勢、瘋狂狀態），試算值用 1.2 的共用函式；驗證：比對 char_2-stats.png，STR 45→50 時困難值顯示 25 [after: 2.2, 1.2]
- [ ] 2.4 做技能一、技能二分頁（分組、搜尋、只看有加點、其他／其他語言自訂列、點數使用量），試算值用 1.3 的共用函式；驗證：比對 char_3-skills1.png、char_4-skills2.png，「只看有加點」只剩有加點的列 [after: 2.2, 1.3]
- [ ] 2.5 依「按確定才存檔」做 Save with server-computed values 與 Leave with unsaved edits 的前端：確定新增／確定修改按鈕、「確定修改？」與「確定離開？」視窗（用 ConfirmDialog）、尚未儲存提示、被拒時保留輸入並顯示訊息（假資料層模擬成功與被拒）；驗證：手動走過 Save with 確定修改、No automatic save、Cancel leaving、Leave a new character、Rejected save 情境 [after: 2.3, 2.4]

## 3. 後端票

- [ ] 3.1 依「ruleData 結構」與「衍生數值由伺服器計算」做角色卡資料表與 `POST`、`GET`、`PATCH /api/characters`：PATCH 只收原始輸入、用 1.2／1.3 的共用函式計算後回傳完整卡；驗證：API 測試改 STR 45→50 後回傳困難值 25、職業點數超支回 400 [after: 1.2, 1.3]
- [ ] 3.2 實作 Delete a character（使用中回 409）、Read-only character summary 與 Field visibility（擁有者完整、同房 GM 完整、同房玩家只有摘要、其他人 403）；驗證：API 測試涵蓋四種身分 [after: 3.1]

## 4. 串接票

- [ ] 4.1 列表、編輯器、確定新增／確定修改存檔改接 API，以伺服器回傳的衍生數值為準；離開時取消新增的角色要呼叫 DELETE；驗證：`VITE_DATA_SOURCE=api` 時手動走過 Save with 確定修改、Leave a new character 與 Rejected save [after: 2.5, 3.1]
- [ ] 4.2 刪除與角色摘要改接 API；驗證：使用中角色刪除時顯示拒絕訊息，摘要在房間大廳顯示 HP、SAN 與簡介開頭 [after: 4.1, 3.2]

## 5. 第二階段（12/24 之後）

- [ ] 5.1 做裝備、背景、紀錄三個分頁（武器列新增刪除並自動帶入技能值、人際關係新增刪除），前後端一起完成；驗證：比對 char_5-equipment.png、char_6-background.png、char_7-log.png，新增手槍武器列顯示 30 / 15 / 6 [after: 4.1]


