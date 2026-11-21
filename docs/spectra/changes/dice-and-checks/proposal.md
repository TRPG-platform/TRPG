## Why

擲骰是跑團的公平核心，技能檢定與理智檢定是百分骰規則最常用的兩個操作。分工表把一般擲骰、CC 技能檢定、SC 理智檢定、明骰／暗骰列為第一階段 ⭐ 功能；設計稿 TV-10、TV-11 右上角是擲骰面板（技能下拉、進行判定、擲骰紀錄）。

## What Changes

- 新增通用擲骰：輸入骰子算式（例如 `1d100`、`3d6+2`、`4d6kh3`），在伺服器端擲出並廣播結果。一次最多 50 顆骰；擲骰面板不分頁，算式框在「進行判定」下方。
- 新增技能檢定（CC）：選角色卡上的技能，可加獎勵骰或懲罰骰，依結果判定大成功／極限成功／困難成功／成功／失敗／大失敗。
- 新增理智檢定（SC）：由 GM 從玩家列表發起並填損失算式，玩家按擲骰；擲 1d100 對目前 SAN，依成功或失敗套用損失算式，更新角色 SAN 並檢查瘋狂條件。
- 新增明骰／暗骰：暗骰結果只有擲骰者與 GM 看得到。
- 擲骰結果寫成聊天 Dice 分頁的訊息，並在擲骰面板顯示擲骰紀錄（成功綠標、失敗紅標）。

## Capabilities

### New Capabilities

- `dice-roller`: 通用核心的骰子算式解析、伺服器端擲骰、明骰／暗骰、擲骰紀錄。
- `percentile-checks`: 百分骰規則模組的技能檢定與理智檢定判定規則。

### Modified Capabilities

(none)

## Impact

- Affected specs: dice-roller、percentile-checks（新增）
- Affected code:
  - New: 前端擲骰面板（遊戲房間右上）
  - New: 後端骰子算式解析器、擲骰服務、檢定判定、擲骰紀錄資料表
- Dependencies: room-lobby（room-realtime）、game-room-chat（Dice 分頁訊息）、character-card（技能值、SAN、percentile-rules）。


