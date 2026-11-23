## 1. 專案骨架（已開票 #1、#2）

- [x] 1.1 （#1）依「單一 repo 分三個資料夾」與「技術選型已定案」建立前端、後端、共用型別三個 workspace，在 repo 根目錄執行 `npm run dev` 能同時啟動前後端；驗證：瀏覽器開得到前端預設頁，`GET /api/health` 回 `{ "ok": true }`
- [ ] 1.2 （#2）加入 ESLint 與 Prettier，`npm run lint` 與 `npm run build` 在前後端都能執行並通過；驗證：兩個指令在乾淨 clone 上執行成功 [after: 1.1]

## 2. 共用資料格式（已開票 #3、#7、#8、#9）

- [ ] 2.1 （#3）在共用型別資料夾定義 Single shared type definitions：`User`、`Script`、`Character`、`Room`、`Message`，欄位符合 Core entity fields 欄位表（含 Script 的 `estimatedHoursMin`、`estimatedHoursMax`），並依「規則專屬資料放 ruleData」落實 Rule-specific data stays in ruleData（HP／SAN／屬性／技能只出現在 `ruleData`）；驗證：前後端各 import 一次並 `npm run build` 成功 [after: 1.1]
- [ ] 2.2 （#9）加入 lint 規則禁止在前後端資料夾重新宣告這五個型別名稱；驗證：故意在前端宣告 `type Room` 時 `npm run lint` 報錯 [after: 1.2, 2.1]
- [ ] 2.3 （#8）寫 roomCode 格式檢查函式（6 碼大寫英數），並用 Example 表的三個值寫單元測試；驗證：測試 A7F3K9 通過、a7f3k9 與 A7F3K 不通過 [after: 2.1]
- [ ] 2.4 （#7）依「資料存取層可切換假資料」建立 Switchable mock data source：前端資料存取層讀 `VITE_DATA_SOURCE`，mock 時回傳設計稿範例（夜行的圖書館、斯卓貝瑞、房號 A7F3K9）；驗證：關掉後端、設成 mock 時頁面無網路錯誤，設成其他值時啟動報錯 [after: 2.1]

## 3. 頁面外框（已開票 #4、#5、#6、#10）

- [ ] 3.1 （#4）依「設計變數用 CSS 變數」建立 Shared design tokens 檔，數值對照 docs/design/figma/README.md，並加入 lint 規則禁止其他檔案出現色碼；驗證：審閱者逐項對照 README 表格，且故意寫 `#ffffff` 時 lint 報錯 [after: 1.2]
- [ ] 3.2 （#5）做 Top navigation bar 元件與 Current page indicator：四個項目順序固定、目前頁面金字加底線、點擊切換頁面不重新整理、頭像選單放帳號設定與登出、不放「設定」；驗證：手動依序點四個項目，比對 p1_TV-02.png 與 p1_TV-07.png [after: 3.1]
- [ ] 3.3 （#6）做 Compact game room header（返回鍵、標誌、鈴鐺、頭像），返回鍵先跳確認框，確認後回首頁、取消則留在原頁；驗證：手動測試確認與取消兩種情況，比對 p1_TV-11.png [after: 3.1]
- [ ] 3.4 （#10）加入 Login redirect for protected pages 的路由守衛：首頁與登入頁以外都需要登入，未登入導向登入頁，登入後回到原本要去的頁面（登入狀態先用假的開關，account-auth 完成後換掉）；驗證：手動切換假登入狀態開「我的角色」頁，兩種情況都符合規格 [after: 3.2]


