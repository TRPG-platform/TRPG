# Figma 設計稿快照

- 來源：Figma 檔案 `x6ouzHCErrn0wFEuoL5nBD`（Untitled）
- 抓取時間：2026-11-20（第二次重抓時檔案 lastModified 2026-11-20T09:43:50Z；和 09:09 版逐一比對 8,947 個圖層，文字、位置、顏色都沒有變）
- 抓取方式：Figma REST API（`GET /v1/files`、`GET /v1/images`），不耗 MCP 額度
- `file.json`：整份檔案的完整節點樹（16.6 MB）。**團隊 repo 沒有放這個檔案**（太大）；需要精確數值時，用 Figma API 重新抓
- `frames/`：三個頁面所有頂層圖層的 PNG，團隊 repo 放了 87 張
  - 沒有 `_x_` 的 23 張：主要畫面（下表）
  - `p1_x_*`、`lobby_x_*`、`char_x_*` 共 77 張：元件、互動狀態、Prototype 畫面、圖示（圖示為 scale 3）
  - `char_x_02`～`char_x_14`（01～13 圖層）在 Figma 裡是空的框，所以沒放；內容全部合併在 `char_x_15_15書籤緞帶.png`

> 設計稿之後若有改動，這份快照不會自動更新，要重新抓。

## 頁面與主要畫面

### TRPG 房間大廳（31:10）
| 圖檔 | Node | 內容 |
|---|---|---|
| `lobby_room-hall.png` | 32:20 | 房間大廳 Desktop 1600×900 |
| `lobby_script-library.png` | 184:237 | 劇本庫管理 Desktop 1536×864 |

另有 Prototype 狀態畫面（選取各劇本、清單檢視、分類 進行中/草稿/已完成、建立新劇本、劇本編輯器，186:3080–186:3943），未匯出。

元件：Player row、Button / Ready、Button / Launch、Icon ×15（book, grid, list, search, chevron, down, plus, edit, more, bell, arrow, upload, star, clock, dice）、Navigation Item、Sidebar Item、Primary Button、Secondary Button、Filter Chip、Status Badge、Tag、Search Input、Icon Button、Pagination Button、Script Card、Script List Row。

### 角色數值板（2:4）
| 圖檔 | Node | 內容 |
|---|---|---|
| `char_TV-2.png` | 161:157 | TV - 2 |
| `char_0-overview.png` | 182:154 | 遊戲畫面 0｜角色總覽 |
| `char_1-identity.png` | 171:4429 | 遊戲畫面 1｜身分 |
| `char_2-stats.png` | 171:4617 | 遊戲畫面 2｜數值 |
| `char_3-skills1.png` | 171:5494 | 遊戲畫面 3｜技能一 |
| `char_4-skills2.png` | 171:6323 | 遊戲畫面 4｜技能二 |
| `char_5-equipment.png` | 171:5008 | 遊戲畫面 5｜裝備 |
| `char_6-background.png` | 171:5214 | 遊戲畫面 6｜背景 |
| `char_7-log.png` | 171:5356 | 遊戲畫面 7｜紀錄 |

另有 01–15 的「筆記本」圖層拆解（背景、牛皮封面、縫線、泛黃內頁、膠帶、迴紋針、機密印章…），未匯出。

### Page 1（0:1）
| 圖檔 | Node |
|---|---|
| `p1_TV-01.png` … `p1_TV-11.png` | 2:3, 2:5, 2:6, 36:183, 141:304, 140:115, 187:1980, 190:3389, 193:3969, 317:2722, 319:3085 |
| `p1_detail-panel.png` | 187:1740 劇本詳細資訊 |

TV - 11 為跑團房間主畫面（角色卡、場景圖、主要頻道/Dice/GM公告、擲骰紀錄、玩家列表、備忘錄）。

## 設計數值（依使用次數統計）

### 顏色 — 大廳 / Page 1（深紫系）
| 用途（推測） | 色碼 |
|---|---|
| 最深背景 | `#17131D` `#211B23` `#241C2B` |
| 面板背景 | `#2B2232` `#282230` `#40313B` |
| 邊框 / 次要面板 | `#51405C` |
| 次要文字 | `#B7AABB` `#ADA3B6` |
| 主要文字 | `#F5EDF6` `#EEE8F3` `#FFFFFF` |
| 主色（紫） | `#9972AD` `#9566C2`，淺紫 `#C4A0D3` |
| 強調金色（GM、標題、邊框） | `#E8D1A5` `#E5CBA3` |
| 狀態 | 綠 `#43866B` / `#18DA11`（成功）|

### 顏色 — 角色數值板（筆記本 / 牛皮紙風格）
紙張 `#F6EDDC` `#F1E5D4` `#E6D3AE`、皮革棕 `#D9B98D` `#B8956A` `#8A6A47`、深色 `#211B23` `#40313B` `#5D4752` `#6B5560`、紫 `#755B8E` `#5E4973`。

### 字型
- 內文：**Noto Sans TC** 400，12 / 13 / 14 / 15 / 16 px 最常用
- 標題：**Noto Serif TC** 700，20 / 25 / 27 / 32 px
- 角色數值板：**Noto Serif TC** 400（14–18 px）＋手寫感 **LXGW WenKai TC**（17–26 px）＋打字機 **Special Elite**
- Page 1 另有少量 SeoulHangang、Yaldevi Colombo、Inter（可能是殘留，實作時建議統一）
- 文字樣式：Script Library / Body、Small、Label、Card title

### 圓角
主要 **12px**（卡片/面板）、**8px**（按鈕/輸入框）、5px、4px；少數 15–22px。
