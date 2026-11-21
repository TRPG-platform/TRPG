## Purpose

Joining a room lets a player enter a game a GM has opened, either by typing the 6-character room code or by opening an invite link. It covers input checking and every reason a join can be refused.

## ADDED Requirements

### Requirement: Join by room code

The join-room page SHALL contain one room-code input with placeholder 請輸入房號 (例如：A7F3K9) and a 加入房間 button. Input SHALL be converted to uppercase as it is typed. The button SHALL stay disabled until exactly 6 valid characters are entered. On success the user SHALL be added to the room's members as a player and taken to that room's lobby.

#### Scenario: Successful join

- **WHEN** a logged-in user types a7f3k9 and clicks 加入房間, and room A7F3K9 is waiting with a free seat
- **THEN** the input shows A7F3K9, the user becomes a member, and the room lobby of A7F3K9 opens

#### Scenario: Button disabled for invalid input

- **WHEN** the input contains A7F3K
- **THEN** the 加入房間 button is disabled

### Requirement: Join refusals

The server SHALL refuse a join and the page SHALL show a specific message, keeping the typed code, in each of these cases.

#### Scenario: Refusal messages

- **WHEN** the join is refused
- **THEN** the page shows the message for that reason and the user stays on the join-room page

##### Example: refusal reasons

| Situation | Message |
|---|---|
| no room has this code | 找不到這個房號，請再確認一次 |
| room has maxPlayers players already | 這個房間已經滿了 |
| room status is playing | 跑團已經開始，無法加入 |
| room status is ended | 這場跑團已經結束 |

### Requirement: Rejoin an already joined room

If the user is already a member of the room (as player or GM), joining SHALL NOT add a second membership and SHALL take the user straight to the room — the lobby while the room is waiting, the game room while it is playing.

#### Scenario: Member re-enters during play

- **WHEN** a player who is already a member enters the code of a room whose status is playing
- **THEN** the game room opens instead of the 跑團已經開始，無法加入 message

### Requirement: Join by invite link

An invite link of the form /join/<roomCode> SHALL behave exactly like typing that code and clicking 加入房間. A visitor who is not logged in SHALL be sent to the login page and then complete the join automatically.

#### Scenario: Visitor opens an invite link

- **WHEN** a visitor who is not logged in opens /join/A7F3K9 and then logs in
- **THEN** the user joins room A7F3K9 without typing the code


