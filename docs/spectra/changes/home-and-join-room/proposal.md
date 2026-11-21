## Why

首頁是玩家進站第一個畫面，也是「建立房間」與「加入房間」的入口。分工表把「加入房間（邀請連結／房號）」列為第一階段 ⭐ 功能；設計稿 TV-1、TV-2 是首頁，TV-3 是輸入房號加入房間。

## What Changes

- 新增首頁：主視覺標語、「建立房間」「搜尋團務」兩顆按鈕、「近期開團」卡片列。
- 新增加入房間頁（TV-3）：輸入 6 碼房號，驗證後進入該房間的房間大廳。
- 支援用邀請連結（含房號）直接加入，不用手動輸入。

## Capabilities

### New Capabilities

- `home-page`: 首頁主視覺、入口按鈕、近期開團卡片列。
- `join-room`: 用房號或邀請連結加入房間，以及各種無法加入時的提示。

### Modified Capabilities

(none)

## Impact

- Affected specs: home-page、join-room（新增）
- Affected code:
  - New: 前端首頁、加入房間頁、近期開團卡片元件
  - New: 後端 `GET /api/rooms/recruiting`（近期開團）、`POST /api/rooms/join`（加入房間）
- Dependencies: project-foundation（頁面外框、Room 型別、roomCode 格式檢查）、account-auth（加入需登入）；房間本身的建立由 room-lobby 負責，本規格只負責加入。


