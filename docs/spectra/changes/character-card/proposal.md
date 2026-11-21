## Why

角色卡是玩家花最多心力的資料，也是擲骰判定的依據（技能值、SAN、HP 都從角色卡來）。分工表把「建立角色卡」「查看角色卡」列為第一階段 ⭐ 功能；設計稿「角色數值板」頁已畫出完整的百分骰規則調查員筆記本（8 個分頁），Page 1 的 TV-8、TV-9 則是較早的簡化版。

## What Changes

- 新增「我的角色卡」頁（TV-9）：以筆記本外觀列出自己的角色，可搜尋、新增、刪除。
- 新增角色卡編輯器，採「角色數值板」8 個分頁：調查員、身分、數值、技能一、技能二、裝備、背景、紀錄。分兩階段：調查員到技能二在 12/19 前完成，裝備、背景、紀錄在 12/24 之後。
- 依百分骰規則自動計算困難／極限值、HP／MP／SAN 上限、體格、傷害加成、移動力、職業與興趣技能點數，以及每個技能的最終值與 ½、⅕ 值。
- 新增角色卡的唯讀預覽，讓 room-lobby 與遊戲房間顯示角色摘要（姓名、職業、立繪、HP、SAN、簡介）。

## Capabilities

### New Capabilities

- `character-sheet`: 角色卡的建立、列表、編輯 8 個分頁、刪除、唯讀預覽，與角色欄位的公開範圍。
- `percentile-rules`: 百分骰規則模組——角色欄位定義與所有衍生數值的計算規則（在伺服器端執行）。

### Modified Capabilities

(none)

## Impact

- Affected specs: character-sheet、percentile-rules（新增）
- Affected code:
  - New: 前端「我的角色卡」頁、筆記本編輯器與 8 個分頁、角色預覽元件
  - New: 後端角色卡 API 與資料表、百分骰規則模組的衍生數值計算
- Dependencies: project-foundation（Character 型別與 ruleData）、account-auth（角色擁有者）。room-lobby（選角色）、dice-and-checks（技能值）、game-room-gm-tools（GM 修改 HP／SAN）都讀取本規格書的資料。
- 工作量大，建議 2 人：一人做前端筆記本與 8 個分頁，一人做後端 API 與 percentile-rules 計算。


