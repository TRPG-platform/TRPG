## Context

擲骰面板位於遊戲房間右上：技能下拉、進行判定按鈕、擲骰紀錄（設計稿上的 3 個未命名分頁之後會拿掉）。docs/guidelines/trpg-web-development.md 第 2 節規定分工：核心負責擲骰、算式解析、暗骰過濾、結果顯示；規則模組負責判定規則與顯示文字，回傳通用等級；第 3 節規定伺服器擲骰、安全亂數、上限、紀錄、固定種子只用於測試。

## Design Source

- 來源：Figma `x6ouzHCErrn0wFEuoL5nBD`，快照 docs/design/figma/frames/p1_TV-10.png、p1_TV-11.png（右上擲骰面板）

| 項目 | 值 |
|---|---|
| 面板 | 背景 `#2B2232`，邊框 `#51405C`，圓角 4px |
| 技能下拉 | 背景 `#40313B`，圓角 4px |
| 進行判定按鈕 | 紫 `#9972AD`，圓角 4px |
| 擲骰紀錄 | 12px 文字；成功標籤綠 `#18DA11`、失敗標籤紅 |

## Goals / Non-Goals

**Goals:**

- 通用擲骰、技能檢定、理智檢定、明骰／暗骰、擲骰紀錄。

**Non-Goals:**

- 對抗檢定、戰鬥輪、幕間成長檢定的自動擲骰、3D 擲骰動畫（第一階段只做數字跳動）。

## Decisions

### 擲骰面板不分頁

**Supersedes**: dice-and-checks / 擲骰面板三個分頁

2026-11-21 決定：設計稿上的分頁之後會拿掉。面板由上到下：技能下拉、獎懲骰、明暗骰、進行判定、算式輸入框＋擲骰（自由擲骰）、擲骰紀錄。GM 從 game-room-gm-tools 的玩家列表選單發起技能檢定要求與理智檢定；理智檢定只有 GM 能發起，損失算式由 GM 填。

### 判定與算式解析放在共用資料夾

算式解析、成功等級判定、理智結算都是純函式，放在共用型別資料夾。前端在假資料階段用它模擬擲骰結果，後端正式擲骰也用同一份。正式的亂數一律在伺服器產生（見「安全亂數可注入」）。這樣前端可以先做，不必等後端。

### 規則模組回傳通用等級

`percentile-checks` 回傳 `{ level: "best" | "positive" | "negative" | "worst", label: "成功" }`；擲骰核心只依 level 決定綠／紅標籤，label 照原樣顯示。核心程式不出現「大成功」等規則名詞。

### 安全亂數可注入

擲骰服務透過介面取得亂數來源，正式環境用 Node.js `crypto.randomInt`，測試注入固定種子產生器；正式模式偵測到種子設定就拒絕啟動。

### 擲骰結果以聊天訊息傳遞

每次擲骰建立一則 `channel: "dice"` 的 Message（附擲骰紀錄 id），沿用 game-room-chat 的可見性過濾與歷史讀取；暗骰對無權限者改送只有「進行了一次暗骰」的訊息。

## Implementation Contract

- **行為**：如兩份規格所述。
- **即時請求**：`dice.roll { expression, hidden }`、`check.skill { characterId, skillId, bonus, penalty, hidden }`、`check.sanity { characterId, lossExpression, hidden }`（GM 限定；玩家端收到提示後送 `check.sanity.roll`）、`check.request { playerId, skillId }`（GM 限定）；廣播沿用 `message.created`，SAN 變更另廣播 `character.status`。
- **失敗模式**：算式錯誤回錯誤事件並附 Example 表中的訊息；檢定別人的角色回 forbidden。
- **驗收**：dice-roller 與 percentile-checks 的每個 Example 表寫成固定種子單元測試；兩個瀏覽器手動驗證暗骰與 GM 要求檢定。
- **範圍內**：算式解析器、擲骰服務、兩種檢定、擲骰面板、擲骰紀錄。
- **範圍外**：上列 Non-Goals。

## Risks / Trade-offs

- [判定規則抄自規則書] → 規則表只寫判定條件，不複製規則書文字（guidelines 第 2 節）。
- [大失敗條件各版本不同] → 採 Example 表的條件，若組員要改，只改 percentile-checks 判定函式與測試。

## Open Questions

無。2026-11-21 已決定：擲骰面板不分頁；理智檢定由 GM 發起並填損失算式；一次最多 50 顆骰。


