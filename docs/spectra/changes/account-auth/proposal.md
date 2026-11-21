## Why

建立房間、角色卡、劇本都要知道「這是誰的」，所以帳號是所有功能的入口。設計稿 TV-4 已有登入畫面，分工表也把登入、註冊、帳號設定列為第一階段 ⭐ 功能。

## What Changes

- 新增登入頁（TV-4）：帳號、密碼、立即登入，以及「沒有帳號嗎？立即註冊」切換到註冊表單。
- 新增註冊：帳號、顯示名稱、密碼、確認密碼。
- 登入狀態在重新整理與關閉分頁後仍保留，直到使用者登出或登入過期。
- 新增登出（使用者頭像選單）與帳號設定（修改顯示名稱、刪除帳號）。
- 取代 project-foundation 中的「假登入開關」，讓受保護頁面的導向使用真正的登入狀態。

## Capabilities

### New Capabilities

- `user-account`: 註冊、登入、登出、登入狀態保存、修改顯示名稱、刪除帳號。

### Modified Capabilities

(none)

## Impact

- Affected specs: user-account（新增）
- Affected code:
  - New: 前端登入／註冊頁、頭像選單、帳號設定頁
  - New: 後端帳號 API（註冊、登入、登出、目前使用者、修改名稱、刪除帳號）與使用者資料表
  - Modified: project-foundation 的路由守衛改讀真正的登入狀態
- Dependencies: project-foundation（共用 User 型別、頁面外框）。


