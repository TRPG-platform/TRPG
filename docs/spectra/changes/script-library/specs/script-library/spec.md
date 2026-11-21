## Purpose

The script library is where a GM keeps the scenarios they run. It lists, filters, and searches the GM's scripts, shows details of the selected script, lets the GM create, edit, delete, favorite, import, and export scripts, and lets GMs share scripts with each other.

## ADDED Requirements

### Requirement: Script list with status filter

The script library page SHALL list only the current user's scripts as cards showing cover image, status badge (草稿, 進行中, 已完成), title, favorite star, rule label, player range, scene count, up to three tags, and a more (⋯) menu. Status chips 全部, 進行中, 草稿, 已完成 SHALL each show the count of the user's scripts in that status, and selecting a chip SHALL show only scripts in that status. A 共用劇本 chip SHALL follow the status chips and open the shared scripts view. A grid/list toggle SHALL switch between cards and one-row-per-script list without losing the current filter.

#### Scenario: Status chip counts and filtering

- **WHEN** the user owns 12 scripts: 2 in progress, 7 drafts, and 3 completed
- **THEN** the chips read 全部 (12), 進行中 (2), 草稿 (7), 已完成 (3), and choosing 草稿 shows only the 7 drafts across the pages

#### Scenario: Toggle list view keeps filter

- **WHEN** the 草稿 chip is selected and the user switches to list view
- **THEN** the list shows the same drafts, one per row

### Requirement: Search and filter scripts

A search box SHALL filter scripts whose title, tags, or rule label contain the typed text (case-insensitive). The 規則系統 dropdown SHALL filter by rule system and the 標籤 dropdown SHALL filter by one or more tags (a script matches when it has all selected tags). Search, status chip, rule system, and tags SHALL combine with AND. When nothing matches, the page SHALL show 找不到符合的劇本.

#### Scenario: Combined filters

- **WHEN** filters are combined
- **THEN** only scripts matching all of them are shown

##### Example: combined filters

| Search | Status | Tags | Shown |
|---|---|---|---|
| 圖書 | 全部 | none | 夜行的圖書館 |
| none | 草稿 | 現代 | 玻璃溫室的花, 終點站的來信 |
| 雪 | 進行中 | none | 找不到符合的劇本 |

### Requirement: Pagination

The library SHALL show 4 scripts per page: one row of 4 cards in grid view, or 4 rows in list view. Scripts SHALL be sorted with favorites first and then by last edited time, newest first. Changing any filter SHALL return to page 1.

#### Scenario: Filter resets page

- **WHEN** the user is on page 3 and selects the 已完成 chip
- **THEN** page 1 of the completed scripts is shown

##### Example: page split

- **GIVEN** the user has 10 scripts and no filter
- **WHEN** the library loads
- **THEN** there are 3 pages holding 4, 4, and 2 scripts

### Requirement: Script detail dialog

Clicking a script card SHALL open a dialog showing the larger cover, status, title, favorite star, rule label, player range, scene count, estimated duration when set, tags, full synopsis, last edited time in the format YYYY-MM-DD HH:mm, and an 編輯劇本 button. Closing the dialog SHALL return to the list with the same filters and page. Changing a filter SHALL close the dialog and clear the selected script.

#### Scenario: Open a script

- **WHEN** the user clicks the card 夜行的圖書館
- **THEN** a dialog shows its synopsis and 最後編輯 2026-11-17 14:28

#### Scenario: Filter change clears the selection

- **WHEN** 夜行的圖書館 is selected and the user chooses the 草稿 chip
- **THEN** no script stays selected and no dialog is open

### Requirement: Create and edit a script

建立新劇本 and 編輯劇本 SHALL open a form with title (1–20 characters, required), cover image (JPG or PNG up to 5 MB, optional), rule system (required), minimum and maximum players (1–10, minimum not greater than maximum), scene count (0–50), estimated duration as minimum and maximum hours (optional, each 1–24, minimum not greater than maximum), tags (up to 5, each up to 8 characters), synopsis (up to 500 characters), status, and the 公開分享 switch. Saving SHALL update the last edited time. A new script SHALL default to status 草稿.

#### Scenario: Rejected form input

- **WHEN** the user saves a form that breaks a rule
- **THEN** the form shows the message for that field and nothing is saved

##### Example: form errors

| Input | Message |
|---|---|
| title with 21 characters | 標題最多 20 字 |
| minimum players 5, maximum players 3 | 最少人數不能大於最多人數 |
| estimated duration 6 to 4 hours | 最短時長不能大於最長時長 |
| 6 MB cover image | 封面圖片不能超過 5 MB |

### Requirement: Delete and favorite

The more (⋯) menu SHALL offer 刪除. Deleting SHALL ask for confirmation and SHALL be refused with 這個劇本正在房間中使用，無法刪除 while any room that is waiting or playing uses the script. Clicking the star SHALL toggle favorite for the current user only.

#### Scenario: Delete blocked by an active room

- **WHEN** the user deletes 夜行的圖書館 while room A7F3K9 using it is waiting
- **THEN** the script is not deleted and the refusal message is shown

### Requirement: Import and export a script file

The more menu SHALL offer 匯出, which downloads the script's data and cover as one file. A 匯入劇本 button next to 建立新劇本 SHALL accept such a file and create a new draft script owned by the importer. A file that is not a valid exported script SHALL be rejected with 檔案格式不正確 and SHALL NOT create anything.

#### Scenario: Round trip

- **WHEN** the user exports 白雪之下 and imports the downloaded file
- **THEN** a new draft named 白雪之下 appears with the same rule system, player range, scene count, estimated duration, tags, synopsis, and cover

#### Scenario: Wrong file

- **WHEN** the user imports a PNG image
- **THEN** 檔案格式不正確 is shown and the script count is unchanged

### Requirement: Share and copy scripts

The 公開分享 switch SHALL be off by default. The shared scripts view, opened from the 共用劇本 chip, SHALL list every shared script from any user, showing the owner's display name, and SHALL offer 複製到我的劇本庫, which creates a new draft owned by the current user. Later edits by the original owner SHALL NOT change copies, and turning sharing off SHALL hide the script from the shared view without deleting existing copies.

#### Scenario: Copy a shared script

- **WHEN** GM 咲野 shares 夜行的圖書館 and GM 翎 clicks 複製到我的劇本庫
- **THEN** 翎's library contains a new draft 夜行的圖書館 owned by 翎

#### Scenario: Unshare keeps copies

- **WHEN** 咲野 then turns 公開分享 off
- **THEN** the script disappears from the shared view and 翎's copy remains


