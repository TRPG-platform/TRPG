## 1. 前端票（先用假資料）

- [ ] 1.1 照 p1_TV-04.png 做登入頁：帳號、密碼、立即登入、錯誤訊息、✕ 回首頁；依「Google 與 Discord 登入延後」兩顆按鈕點擊只顯示「即將推出」；假資料層模擬 Log in 成功與帳密錯誤；驗證：手動比對設計圖並測試帳密錯誤情境
- [ ] 1.2 做註冊表單（同一張卡片，從「立即註冊」切換），顯示 Register an account 各欄位錯誤，成功後自動登入並回首頁；驗證：假資料下手動走過 registration errors 範例表四列與成功情境 [after: 1.1]
- [ ] 1.3 做頭像選單（帳號設定、登出）與帳號設定頁（改名稱、輸入帳號名稱才能刪除帳號）；驗證：假資料下改名後頂欄更新、輸入錯誤帳號名時刪除按鈕維持停用

## 2. 後端票

- [ ] 2.1 建立使用者資料表並依「密碼用 bcrypt 雜湊」實作 `POST /api/auth/register`，含帳號格式、唯一性（不分大小寫）、密碼長度、名稱長度檢查；驗證：單元測試涵蓋 registration errors 範例表四列
- [ ] 2.2 依「登入狀態用 httpOnly cookie」實作 `POST /api/auth/login` 與 `GET /api/auth/me`，落實 Login persists until logout or expiry（7 天）；驗證：測試正確帳密拿到 cookie、錯誤帳密回 401 且訊息相同、過期 session 的 `/me` 回 401 [after: 2.1]
- [ ] 2.3 實作 Log out 與 Account settings 的 API：`POST /api/auth/logout`、`PATCH /api/users/me`、`DELETE /api/users/me`（連帶刪角色卡與劇本、結束擔任 GM 的房間）；驗證：測試登出後 `/me` 回 401、刪除後該使用者資料查不到 [after: 2.2]

## 3. 串接票

- [ ] 3.1 登入、註冊改接 API，並把 project-foundation 路由守衛的假登入開關換成 `GET /api/auth/me`，登入後回到原本要去的頁面；驗證：未登入開「我的角色」被導向登入頁，登入後回到「我的角色」 [after: 1.2, 2.2]
- [ ] 3.2 頭像選單、帳號設定改接 API；驗證：`VITE_DATA_SOURCE=api` 時改名後重新整理仍是新名稱、登出後回首頁 [after: 1.3, 2.3, 3.1]


