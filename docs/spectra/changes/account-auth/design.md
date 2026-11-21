## Context

依賴 project-foundation 的共用 `User` 型別與路由守衛。設計稿只有登入畫面 TV-4，沒有註冊與帳號設定畫面。安全原則見 docs/guidelines/trpg-web-development.md 第 9 節。

## Design Source

- 來源：Figma `x6ouzHCErrn0wFEuoL5nBD`，快照 docs/design/figma/frames/p1_TV-04.png
- 版面：左側標語「把大家的故事放在同一張案上。」（Noto Serif TC 700），右側表單卡片

| 項目 | 值 |
|---|---|
| 表單卡片背景 | `#40313B`，圓角 8px |
| 輸入框背景 | `#211B23`，圓角 8px |
| 立即登入按鈕 | 紫 `#9972AD` 系，圓角 8px |
| 左上角關閉鍵 | ✕，回到首頁 |

註冊表單與帳號設定沿用同一張卡片樣式。

## Goals / Non-Goals

**Goals:**

- 帳號密碼註冊、登入、登出、修改名稱、刪除帳號。
- 登入狀態 7 天內有效。

**Non-Goals:**

- 忘記密碼、Email 驗證（第一階段不收 Email）。

## Decisions

### 登入狀態用 httpOnly cookie

伺服器在登入後發一個 session，存在 httpOnly、SameSite=Lax 的 cookie。不用存在 localStorage 的 JWT，因為頁面腳本讀得到，遇到 XSS 會被偷走。

### 密碼用 bcrypt 雜湊

密碼只存 bcrypt 雜湊（cost 10 以上），不存原文。

### Google 與 Discord 登入延後

設計稿有「使用 Google 帳號」「使用 Discord 帳號」兩顆按鈕。第一階段按鈕照設計稿顯示，但點了只顯示「即將推出」；實作另開後續規格書 social-login。理由：OAuth 需要向 Google／Discord 申請應用程式與回呼網址，部署主機未定前無法完成。

## Implementation Contract

- **行為**：TV-4 登入頁可登入；點「立即註冊」切換為註冊表單；頭像選單有帳號設定與登出。
- **API**：`POST /api/auth/register`、`POST /api/auth/login`、`POST /api/auth/logout`、`GET /api/auth/me`（未登入回 401）、`PATCH /api/users/me`（改名稱）、`DELETE /api/users/me`。
- **失敗模式**：輸入錯誤回 400 並附欄位名稱與錯誤訊息；帳密錯誤一律回 401「帳號或密碼錯誤」；帳號重複回 409。
- **驗收**：規格中的每個情境手動走一次；後端對註冊規則表寫單元測試。
- **範圍內**：上述 API、登入／註冊頁、頭像選單、帳號設定頁、路由守衛改接真實登入。
- **範圍外**：OAuth、忘記密碼、Email。

## Risks / Trade-offs

- [刪除帳號連帶刪資料，誤刪無法復原] → 要求輸入帳號名稱確認。
- [後端 12/16 才上完] → 12/16 前前端用 project-foundation 的 mock 資料來源做畫面。

## Open Questions

無。2026-11-21 已決定：帳號設定放在右上角頭像選單，導覽列不放「設定」。


