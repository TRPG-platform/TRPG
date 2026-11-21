## Why

跑團時 GM 要能切換場景、展示 NPC 立繪與道具、記錄線索、調整玩家數值；玩家要隨時看到自己的角色狀態。分工表把「素材上傳管理」「GM 引導視角」「氣氛特效」列為第一階段 ⭐ 功能；設計稿 TV-10（GM 視角）與 TV-11（玩家視角）畫出了遊戲房間除聊天、擲骰以外的所有面板。

## What Changes

- 新增遊戲房間的版面：上方場景區、左右側面板，GM 與玩家看到不同面板。
- 新增素材庫：背景、立繪、道具三個分類，上傳、刪除、縮圖列表；依房間設定允許或禁止玩家上傳。
- 新增 GM 引導視角：GM 切換場景背景、展示或收回立繪與道具，所有玩家畫面同步切換（展示立繪與道具是否延到 12/24 之後，由組員問卷 Q3 決定）。
- 新增角色面板：玩家看自己的角色（摘要、屬性、技能、持有物、背景、備註），HP／SAN 即時更新；GM 看玩家列表並可調整每位玩家的 HP／MP／SAN，也從玩家選單發起技能檢定與理智檢定；玩家點別人只看摘要。
- 新增備忘錄：GM 維護「目前線索」清單，所有成員即時看到。
- 新增氣氛特效：GM 開啟「特效」後，SAN 偏低的玩家畫面會變暗，極低時閃爍。

## Capabilities

### New Capabilities

- `scene-assets`: 素材上傳與管理、場景切換、立繪與道具展示（GM 引導視角）。
- `game-room-panels`: 遊戲房間版面、玩家角色面板、GM 玩家列表與數值調整、備忘錄線索。
- `atmosphere-effects`: 依 SAN 值觸發的畫面變暗與閃爍特效，以及 GM 開關。

### Modified Capabilities

(none)

## Impact

- Affected specs: scene-assets、game-room-panels、atmosphere-effects（新增）
- Affected code:
  - New: 前端遊戲房間版面、場景區、素材庫面板、角色面板、玩家列表、備忘錄、特效圖層
  - New: 後端素材上傳與儲存、場景狀態、線索、GM 調整數值的即時事件
- Dependencies: room-lobby（room-realtime、房間設定、場景與素材管理入口）、character-card（角色資料與摘要、percentile-rules 的上下限）、game-room-chat 與 dice-and-checks 佔用版面中的聊天區與擲骰面板。


