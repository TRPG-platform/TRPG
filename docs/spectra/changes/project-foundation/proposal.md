## Why

九份規格書要分給不同組員同時開發，但目前 repo 沒有任何程式碼，也沒有共用的頁面框架、色彩字型與資料格式。若每人各自做，頂部導覽列會長得不一樣、角色／房間／訊息的資料欄位對不起來，12/17–12/22 接後端時會大量返工，所以要先做一份所有人都依賴的地基。

## What Changes

- 建立前後端同一個 repo 的專案骨架（前端、後端、共用型別三個資料夾），一個指令就能在本機啟動。
- 建立全站共用的頁面外框：頂部導覽列（TAKOYAKI 標誌、首頁／劇本管理／我的角色／教學與資源、通知鈴鐺、使用者頭像）與跑團房間用的精簡頂欄（返回鍵＋標誌）。
- 把 Figma 設計稿的色彩、字型、圓角整理成全站共用的設計變數（design tokens），其他規格書一律引用，不各自寫死色碼。
- 定義四種共用資料格式：使用者、劇本、角色卡、房間（含房間內訊息的基本欄位），放在共用型別資料夾，前後端都引用同一份。
- 建立假資料（mock data）機制，讓前端在 12/16 後端課程結束前就能用假資料做畫面。

## Capabilities

### New Capabilities

- `app-shell`: 全站頁面外框——頂部導覽列、目前頁面標示、跑團房間精簡頂欄、未登入時的導向、共用設計變數。
- `shared-data-model`: 前後端共用的使用者、劇本、角色卡、房間、訊息資料格式，以及前端可切換的假資料來源。

### Modified Capabilities

(none)

## Impact

- Affected specs: app-shell, shared-data-model（新增）
- Affected code:
  - New: 前端專案資料夾（頁面外框、導覽列元件、設計變數）
  - New: 後端專案資料夾（啟動入口與健康檢查）
  - New: 共用型別資料夾（使用者、劇本、角色卡、房間、訊息型別與假資料）
  - New: repo 根目錄的啟動腳本與程式碼格式設定
- Dependencies: 技術選型尚待組員確認，提案採用 docs/planning/feature-division.md 9-1 節的方案（前端 React + TypeScript、後端 Node.js + Express、即時同步 Socket.IO）。
- 其他 8 份規格書（account-auth、home-and-join-room、script-library、character-card、room-lobby、game-room-chat、dice-and-checks、game-room-gm-tools）都依賴本規格書。

