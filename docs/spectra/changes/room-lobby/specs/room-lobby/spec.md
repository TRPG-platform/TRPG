## Purpose

The room lobby is where a GM opens a game and players gather before play: the GM creates the room and sets it up, players pick the character they will use and mark ready, everyone reads the GM's announcement, and the GM starts the game.

## ADDED Requirements

### Requirement: Create a room

A logged-in user SHALL be able to create a room by choosing one of their scripts, a maximum player count (1–8, default the script's maximum), an optional scheduled start date and time, and whether the room is public. Creating the room SHALL make the user its GM, generate a unique 6-character room code, set status to waiting, and open the room lobby.

#### Scenario: Create from a script

- **WHEN** the user chooses 夜行的圖書館, max players 5, start 11/21 20:00, public on
- **THEN** a waiting room with a new unique room code is created and its lobby opens with the user as GM

#### Scenario: No scripts yet

- **WHEN** a user with no scripts opens the create-room flow
- **THEN** the flow shows 你還沒有劇本 with a link to 建立新劇本

### Requirement: Room code and invite link

The lobby SHALL show 房號 with the room code and a copy button, and an invite-link button that copies the address /join/<roomCode>. Copying SHALL show 已複製 for 2 seconds.

#### Scenario: Copy invite link

- **WHEN** a member clicks the invite-link button in room A7F3K9
- **THEN** the clipboard contains the site address followed by /join/A7F3K9 and 已複製 appears

### Requirement: Lobby overview

Every member SHALL see the script cover, title, rule label, play style, synopsis, GM name, rule, player count as joined/max, expected duration (the script's estimated hours, for example 約 4–6 小時, hidden when the script has none), scheduled start, and tags on the left, and the member list with count (joined/max) in the middle. Each member row SHALL show avatar, GM or PL badge, display name, an online dot, and for players a 已準備 mark when ready. The bottom bar SHALL show 已準備 X / Y 位玩家 where Y counts players only.

#### Scenario: Ready count

- **WHEN** a room has a GM and 4 players, 3 of whom are ready
- **THEN** the member header shows 玩家（4/5） and the bottom bar shows 已準備 3 / 4 位玩家

### Requirement: Choose a character for this game

A player SHALL choose exactly one of their characters for this room from the 角色庫 tab, which lists their characters, and see the chosen one on the 我的角色 tab as the read-only summary with 已選擇該角色. 建立新角色 SHALL open the character editor and return to the lobby afterwards. When the GM setting 禁止PL使用既有角色 is on, the 角色庫 tab SHALL list only characters created after the player joined this room.

#### Scenario: Choose a character

- **WHEN** a player selects 斯卓貝瑞 in 角色庫
- **THEN** the 我的角色 tab shows 斯卓貝瑞's summary with 已選擇該角色, and other members see the player's row unchanged until they mark ready

#### Scenario: Existing characters disallowed

- **WHEN** 禁止PL使用既有角色 is on and the player's only characters were created last week
- **THEN** the 角色庫 tab is empty except for 建立新角色

### Requirement: Ready state

A player SHALL toggle between 玩家未準備 and ✓ 準備完成 with the bottom button. The button SHALL be disabled until the player has chosen a character. Changing the chosen character SHALL reset the player to not ready. The ready state SHALL update on every member's screen through room-realtime.

#### Scenario: Ready requires a character

- **WHEN** a player with no chosen character views the bottom bar
- **THEN** the ready button is disabled

#### Scenario: Changing character resets ready

- **WHEN** a ready player chooses a different character
- **THEN** the player becomes not ready on every member's screen

### Requirement: GM game settings

Only the GM SHALL see and change the 跑團設定 panel: rule system dropdown with the options CoC 7e, CoC 6e, CoC 5e and four switches — 禁止PL使用既有角色, 禁止PL上傳素材, 開放密語頻道（GM→指定玩家）, 開放密語頻道（玩家→玩家）. Changes SHALL be saved to the room's settings and broadcast to all members.

#### Scenario: Player cannot change settings

- **WHEN** a player sends a request to turn on 開放密語頻道（玩家→玩家）
- **THEN** the server rejects it and the setting is unchanged

### Requirement: GM announcement

The GM SHALL be able to write, edit, and clear one announcement for the room, up to 1000 characters, plus an optional 團務須知 link. Every member SHALL see it in the GM 公告欄 with the GM's name and the time of the last edit, and the announcement SHALL be available to the game room's GM公告 tab.

#### Scenario: Announcement update

- **WHEN** the GM edits the announcement at 11/12 18:32
- **THEN** every member's GM 公告欄 shows the new text with 11/12 18:32 within 2 seconds

### Requirement: Start the game

The GM's 開始跑團 button SHALL be enabled only when the room has at least one player and every player is ready. Starting SHALL set the room status to playing and move every connected member to the game room. 預覽房間 SHALL open the game room in a read-only preview for the GM without changing the status. 編輯劇本 SHALL open the script's edit form and 場景與素材管理 SHALL open the scene and asset manager owned by game-room-gm-tools.

#### Scenario: Not everyone ready

- **WHEN** 2 of 3 players are ready
- **THEN** 開始跑團 is disabled and shows 等待所有玩家準備

#### Scenario: Start moves everyone

- **WHEN** all 3 players are ready and the GM clicks 開始跑團
- **THEN** the room status becomes playing and all connected members are taken to the game room

### Requirement: Leave the lobby

A player who leaves a waiting room SHALL be removed from its members, freeing the seat. The GM SHALL NOT leave without first choosing 解散房間, which ends the room for everyone and returns all members to the home page.

#### Scenario: Player leaves

- **WHEN** a player in a 4/5 room leaves
- **THEN** the member count becomes 3/5 for everyone

#### Scenario: GM disbands

- **WHEN** the GM chooses 解散房間 and confirms
- **THEN** the room status becomes ended and every member is returned to the home page with 房間已解散


