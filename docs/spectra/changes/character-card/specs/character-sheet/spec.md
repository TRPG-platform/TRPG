## Purpose

The character sheet lets a player create, view, edit, and delete their investigators in a notebook-style editor, and gives other features a read-only character summary. It stores rule-specific values through the percentile-rules module.

## ADDED Requirements

### Requirement: My characters list

The 我的角色卡 page SHALL show the current user's characters as cards with portrait (or a placeholder silhouette), name, occupation, and up to three tags, 8 cards per notebook spread, with previous/next page controls when there are more. A search box SHALL filter by name, occupation, or tag. The first card slot SHALL be 點此新增調查員檔案, which creates a new character and opens the editor.

#### Scenario: Create from the list

- **WHEN** the user clicks 點此新增調查員檔案
- **THEN** a new character named 未命名調查員 is created and the editor opens on the 身分 tab

#### Scenario: Search characters

- **WHEN** the user types 警察 in the search box
- **THEN** only characters whose name, occupation, or tags contain 警察 are shown

### Requirement: Notebook editor tabs

The editor SHALL present the character as an open notebook with eight side tabs in this order: 調查員, 身分, 數值, 技能一, 技能二, 裝備, 背景, 紀錄. Each tab SHALL contain the fields below.

| Tab | Fields |
|---|---|
| 身分 | portrait upload, name, player name, file number, created date, occupation, occupation detail, education, era, gender, age, age adjustment, birthplace, residence, appearance |
| 數值 | nine attributes (initial and adjustment), current HP/MP/SAN/LUCK with − and + buttons, Build, Damage Bonus, MOV, injury state (健康, 重傷, 瀕死, 昏迷), insanity state (無, 暫時性瘋狂, 不定性瘋狂, 永久性瘋狂), insanity symptoms |
| 技能一, 技能二 | skills grouped as 社交, 移動, 戰鬥, 槍枝, 語言, 學問, 職業興趣, 調查; each row has a used-this-session checkbox, base, occupation, interest, growth, final, ½, ⅕; a skill search box and a 只看有加點 filter; custom rows for 其他 and 其他語言 |
| 裝備 | weapon list (weapon, skill, normal/hard/extreme, damage, range, uses, ammo, malfunction) with add and remove, belongings, special or magic items |
| 背景 | 思想與信念, 重要之人, 意義非凡之地, 寶貴之物, 特點, 羈絆, 背景故事, 故事小劇場／導入 |
| 紀錄 | relations (character, player, relation) with add and remove, 跑過劇本, 冒險故事特殊事件, 創傷或傷疤, 恐懼與狂熱, 第三類接觸, 閱讀的古籍, 已知法術及其使用方法 |

#### Scenario: Switch tabs keeps edits

- **WHEN** the user types an occupation on 身分, switches to 數值, and returns to 身分
- **THEN** the typed occupation is still shown

#### Scenario: Weapon row uses skill value

- **WHEN** the user adds a weapon row with skill 手槍 whose final value is 30
- **THEN** the row shows normal/hard/extreme as 30 / 15 / 6

### Requirement: Save with server-computed values

Edits SHALL NOT be saved automatically. While editing, the top-right button SHALL read 確定新增 for a character just created from the list, and 確定修改 for an existing character; the page SHALL show 尚未儲存 while there are unsaved edits. 確定新增 SHALL save and return to the 調查員 overview. 確定修改 SHALL first ask 確定修改？ in a confirmation dialog, then save and return to the overview; with no edits it SHALL return to the overview without asking. Every save SHALL send only raw inputs; the server SHALL compute and return all derived values defined in percentile-rules, and the editor SHALL display the returned values. A rejected save SHALL keep the user's inputs and show the server's message next to the field.

#### Scenario: Save with 確定修改

- **WHEN** the user changes STR from 45 to 50, clicks 確定修改, and confirms
- **THEN** the change is saved, the overview is shown, and the hard value becomes 25 as returned by the server

#### Scenario: No automatic save

- **WHEN** the user changes STR from 45 to 50 and waits without clicking 確定修改
- **THEN** nothing is saved and the page shows 尚未儲存

#### Scenario: Rejected save

- **WHEN** a save is rejected with 職業點數超出上限
- **THEN** the typed skill points remain on screen and the message appears above the skill table

### Requirement: Leave with unsaved edits

When the user tries to leave the editor without saving — by the 調查員 tab, the navigation bar's back button, a navigation bar link, or the browser's back button — and the character is newly created or has unsaved edits, the page SHALL ask 確定離開？ in a confirmation dialog. 取消 SHALL keep the user on the editor with the edits intact. 確定離開 SHALL discard the edits; for a character created but not yet confirmed with 確定新增, it SHALL also delete that character.

#### Scenario: Cancel leaving

- **WHEN** the user edits an existing character, clicks the 調查員 tab, and chooses 取消
- **THEN** the editor stays open with the edits intact

#### Scenario: Leave a new character

- **WHEN** the user creates a character, then clicks 首頁 in the navigation bar and chooses 確定離開
- **THEN** the new character is deleted and the home page opens

### Requirement: Delete a character

The user SHALL be able to delete their own character after confirming. A character currently selected in a room that is waiting or playing SHALL NOT be deletable, and the page SHALL show 這個角色正在房間中使用，無法刪除.

#### Scenario: Delete blocked during play

- **WHEN** the user deletes 斯卓貝瑞 while it is selected in a playing room
- **THEN** the character is kept and the refusal message is shown

### Requirement: Read-only character summary

The capability SHALL provide a read-only summary of a character — portrait, name, occupation, HP current/max, SAN current/max, and the first 200 characters of the appearance or backstory — for use by room-lobby and the game room. The owner SHALL be able to open the full sheet from the summary.

#### Scenario: Summary in the room lobby

- **WHEN** room-lobby shows the character 沈映月 with current HP 11 and current SAN 65
- **THEN** it shows 沈映月, 音樂家, HP 11/11, SAN 65/99, and the start of the appearance text

### Requirement: Field visibility

Only the owner SHALL be able to edit a character. Inside a room, the GM SHALL be able to view the whole sheet, and other players SHALL see only the read-only summary. Outside rooms, nobody except the owner SHALL be able to view the character.

#### Scenario: Other player cannot read the backstory

- **WHEN** a player in the same room requests another player's full sheet
- **THEN** the server returns only the summary fields


