## Purpose

Room chat is the text channel where a game is played: the GM narrates, players speak and act, and members whisper privately. Messages are delivered live to the right members, can be edited or deleted, and are stored so the history survives reloads.

## ADDED Requirements

### Requirement: Chat tabs

The game room chat area SHALL have three tabs: 主要頻道, Dice, and GM公告. 主要頻道 SHALL show public messages and whispers the viewer may see, oldest at the top. Dice SHALL show only dice result messages. GM公告 SHALL show the room's GM announcement. A tab that receives a new item while not selected SHALL show an unread dot until selected.

#### Scenario: Unread dot

- **WHEN** a dice result arrives while the viewer is on 主要頻道
- **THEN** the Dice tab shows an unread dot that disappears when the viewer opens Dice

### Requirement: Send public messages

A member SHALL send a message by typing in the 輸入訊息… box and pressing Enter or the send button; Shift+Enter SHALL insert a line break. Messages SHALL be 1–1000 characters after trimming spaces, SHALL be shown as plain text (no HTML is rendered), and SHALL appear for every member through room-realtime. Each message SHALL show the sender's avatar, GM or PL badge, display name, and text.

#### Scenario: Message reaches everyone

- **WHEN** the GM sends 你們推開了厚重的木門
- **THEN** every member's 主要頻道 shows it with the GM badge within 2 seconds

#### Scenario: Rejected input

- **WHEN** a member sends text that breaks a rule
- **THEN** the message is not sent and the input keeps the text

##### Example: message input

| Input | Result |
|---|---|
| three spaces | send button disabled |
| 1001 characters | 訊息不能超過 1000 字 |
| `<b>hi</b>` | sent and shown literally as `<b>hi</b>` |

### Requirement: Whisper messages

A recipient selector next to the input SHALL default to 所有人 and list the other members. Sending to a member SHALL create a whisper visible only to the sender, the chosen recipient, and the GM. Whispers SHALL be shown with a 密語 label and the recipient's name. The server SHALL allow: player to GM always; GM to player only when 開放密語頻道（GM→指定玩家） is on; player to player only when 開放密語頻道（玩家→玩家） is on. Members not allowed to see a whisper SHALL NOT receive it from the server at all.

#### Scenario: Whisper visibility

- **WHEN** player 波太透 whispers to player 補路貝瑞 with player-to-player whispers on
- **THEN** 波太透, 補路貝瑞, and the GM see the message, and player 斯卓貝瑞's browser receives no data about it

#### Scenario: Whisper not allowed

- **WHEN** 開放密語頻道（玩家→玩家） is off
- **THEN** other players are not listed in a player's recipient selector and a forged request is rejected by the server

### Requirement: Edit and delete messages

A member SHALL edit or delete their own public or whisper messages from the message's menu. An edited message SHALL show （已編輯）. A deleted message SHALL be replaced by 此訊息已刪除 for everyone who could see it. The GM SHALL be able to delete any message in the room. Dice result messages SHALL NOT be editable by anyone.

#### Scenario: Edit own message

- **WHEN** 補路貝瑞 edits their message to 我檢查書架
- **THEN** every viewer sees 我檢查書架 （已編輯）

#### Scenario: GM deletes a player message

- **WHEN** the GM deletes a player's message
- **THEN** every viewer sees 此訊息已刪除 in its place

#### Scenario: Dice results are locked

- **WHEN** a member opens the menu of a dice result message
- **THEN** no edit option is shown and a forged edit request is rejected

### Requirement: Message history

Messages SHALL be stored on the server. Entering or reloading the game room SHALL show the latest 50 messages the viewer may see, and scrolling to the top SHALL load the previous 50 until none remain.

#### Scenario: Reload keeps history

- **WHEN** a member reloads the game room after 120 messages were sent
- **THEN** the latest 50 are shown, and scrolling up twice shows all 120

### Requirement: GM announcement tab

The GM公告 tab SHALL show the announcement maintained by room-lobby with the GM's name and last edit time. The GM SHALL be able to edit it from this tab during play, and every member SHALL see the update and the unread dot.

#### Scenario: Update during play

- **WHEN** the GM updates the announcement during play
- **THEN** every member's GM公告 tab shows the new text and an unread dot if not selected

### Requirement: Image messages

The ＋ button at the left of the chat input SHALL let a member attach one image (JPG, PNG, or WebP, at most 5 MB) to a message, public or whisper. The image SHALL be shown in the message as a thumbnail that enlarges when clicked, and SHALL be visible only to the members who can see that message. Image files SHALL be stored the same way as scene assets and served only to room members.

#### Scenario: Send an image

- **WHEN** a player attaches map.png (1 MB) and sends it to 所有人
- **THEN** every member sees the thumbnail in 主要頻道 and can click it to enlarge

#### Scenario: Rejected image

- **WHEN** a member attaches a 6 MB image or a PDF file
- **THEN** the message is not sent and the input shows 只接受 JPG、PNG、WebP，且不能超過 5 MB


