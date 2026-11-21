## Purpose

Game room panels arrange everything around the chat and dice areas during play: the scene area, the player's own character panel, the GM's player list with stat adjustment, the shared clue memo, and the GM's settings panel.

## ADDED Requirements

### Requirement: Role-based game room layout

The game room SHALL use the compact room header and place the scene area top-centre, the chat area below it, and the dice panel top-right for everyone. For a player, the left panel SHALL be their own character panel and the right column SHALL show the dice panel, the player list, and the memo. For the GM, the left panel SHALL be the player list followed by the game settings, and the right column SHALL show the dice panel, the asset library, and the memo.

#### Scenario: Player layout

- **WHEN** a player opens the game room
- **THEN** the left panel shows their own character and the right column shows 玩家列表 and 備忘錄

#### Scenario: GM layout

- **WHEN** the GM opens the game room
- **THEN** the left panel shows every player with portrait, PL badge, name, and occupation, followed by 使用規則 and the four switches

### Requirement: Own character panel

A player's character panel SHALL show the character summary (portrait, name, occupation, HP current/max, SAN current/max) and collapsible sections 屬性, 技能（N）, 持有物, 背景, 備註. 技能（N） SHALL list only skills with occupation, interest, or growth points, where N is their count. HP and SAN SHALL update on screen within 2 seconds of any change by the GM or by a sanity check.

#### Scenario: Skills section counts trained skills

- **WHEN** the character has points in 圖書館使用, 聆聽, 心理學, 偵查, 歷史 only
- **THEN** the section header reads 技能（5） and lists those five skills with their final values

#### Scenario: Live SAN update

- **WHEN** a sanity check lowers the player's SAN from 70 to 66
- **THEN** the panel shows SAN 66/73 without reloading

### Requirement: GM adjusts player stats

The GM SHALL open any player's full character sheet from the player list and adjust current HP, MP, SAN, and LUCK with − and + buttons or by typing a value. The server SHALL clamp values to the limits from percentile-rules, save them to the character, and broadcast the change. Players SHALL NOT change another character's values.

#### Scenario: Clamped adjustment

- **WHEN** the GM types HP 15 for a character whose HP max is 11
- **THEN** the stored and displayed HP is 11

### Requirement: Shared clue memo

The 備忘錄 panel SHALL show a 目前線索 list visible to every member. The GM SHALL add, edit, reorder, and remove clues of up to 200 characters each, at most 50 clues per room. Changes SHALL appear for every member within 2 seconds. Players SHALL only read the list.

#### Scenario: GM adds a clue

- **WHEN** the GM adds 破損書頁（疑似儀式）
- **THEN** every member's 目前線索 list shows it at the bottom

### Requirement: In-game settings panel

The GM's settings panel SHALL show the room's 使用規則 and the switches 特效, 禁止PL上傳素材, 開放密語頻道（GM→指定玩家）, 開放密語頻道（玩家→玩家）. Changing a switch SHALL take effect for every member immediately and SHALL be the same setting edited in the room lobby. The rule system SHALL be read-only once the game has started.

#### Scenario: Toggle whispers during play

- **WHEN** the GM turns off 開放密語頻道（玩家→玩家） during play
- **THEN** players can no longer pick other players as whisper recipients

### Requirement: GM player menu

In the GM's player list, clicking a player SHALL open a menu with 查看角色卡, 要求技能檢定, and 理智檢定. 查看角色卡 SHALL open that character's full sheet with stat adjustment. 要求技能檢定 and 理智檢定 SHALL start the flows defined in dice-and-checks for that player.

#### Scenario: Open the GM player menu

- **WHEN** the GM clicks 斯卓貝瑞 in the player list
- **THEN** a menu shows 查看角色卡, 要求技能檢定, and 理智檢定

### Requirement: View other players' summary

In a player's player list, clicking another player SHALL show only that character's read-only summary: portrait, name, occupation, HP current/max, SAN current/max, and the start of the profile text. Attributes, skills, and backstory SHALL NOT be shown or sent to the player's browser.

#### Scenario: Player views another character

- **WHEN** player 波太透 clicks 斯卓貝瑞 in the player list
- **THEN** 波太透 sees 斯卓貝瑞's summary, and the data received contains no skills or backstory


