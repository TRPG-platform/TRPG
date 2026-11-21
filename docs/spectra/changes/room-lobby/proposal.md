## Why

開團前 GM 與玩家要在同一個地方集合：GM 設定規則與權限、發布公告，玩家選角色、按準備，全員準備好才開始跑團。分工表把「建立房間／產生邀請連結」「選擇角色卡進入本次遊戲」「發布 GM 公告」列為第一階段 ⭐ 功能；設計稿 TV-5（玩家視角）與 TV-6（GM 視角）畫出了房間大廳。

## What Changes

- 新增建立房間流程：GM 選劇本、設定人數上限、開團時間、是否公開，產生 6 碼房號與邀請連結。
- 新增房間大廳頁：左側劇本資訊、玩家列表（GM／PL 標籤、在線狀態、已準備）、房號與邀請連結複製。
- 玩家視角（TV-5）：「我的角色／角色庫」選擇本次使用的角色、建立新角色、GM 公告欄、準備按鈕。
- GM 視角（TV-6）：跑團設定（規則、四個權限開關）、GM 工具（預覽房間、編輯劇本、場景與素材管理、開始跑團）、發布與編輯 GM 公告。
- 建立房間內的即時連線：成員加入離開、準備狀態、公告、設定變更即時同步給房間內所有人；之後 game-room-chat、dice-and-checks、game-room-gm-tools 都沿用這條連線。

## Capabilities

### New Capabilities

- `room-lobby`: 建立房間、房間大廳的成員與準備狀態、角色選擇、跑團設定、GM 公告、開始跑團。
- `room-realtime`: 房間內的即時連線、依房間分組廣播、斷線重連後補回最新狀態、伺服器端權限檢查。

### Modified Capabilities

(none)

## Impact

- Affected specs: room-lobby、room-realtime（新增）
- Affected code:
  - New: 前端建立房間表單、房間大廳頁（PL 與 GM 兩種視角）
  - New: 後端房間 API、房間資料表、Socket.IO 房間連線與事件
- Dependencies: project-foundation（Room 型別、精簡頂欄）、account-auth、script-library（選劇本）、character-card（選角色、角色摘要）。home-and-join-room 的加入流程會把人帶進本規格的大廳。


