## Purpose

Scene assets are the images a room uses during play — backgrounds, character portraits, and props. This capability covers uploading and managing them, and the GM-guided view in which the GM switches the scene and shows or hides portraits and props on every member's screen at once.

## ADDED Requirements

### Requirement: Asset library

Each room SHALL have an asset library with three categories shown as tabs: 背景, 立繪, 道具. Each tab SHALL show thumbnails of that category's assets in upload order. Assets SHALL be JPG, PNG, or WebP files of at most 5 MB, and each room SHALL hold at most 40 assets in total across the three categories. The library SHALL be reachable from the game room side panel and from 場景與素材管理 in the room lobby.

#### Scenario: Upload rules

- **WHEN** a member uploads a file
- **THEN** it is accepted or rejected as follows

##### Example: uploads

| File | Result |
|---|---|
| library.jpg, 2 MB | accepted |
| map.png, 6 MB | rejected: 圖片不能超過 5 MB |
| notes.pdf | rejected: 只接受 JPG、PNG、WebP |
| 41st asset in the room | rejected: 素材數量已達上限 40 |

### Requirement: Who can upload and delete

The GM SHALL be able to upload to any category and delete any asset. A player SHALL be able to upload only when 禁止PL上傳素材 is off, and SHALL be able to delete only assets they uploaded. Asset files SHALL be served only to members of the room.

#### Scenario: Player upload blocked

- **WHEN** 禁止PL上傳素材 is on and a player tries to upload
- **THEN** the upload button is hidden for the player and a forged upload request is rejected by the server

#### Scenario: Non-member cannot fetch an asset

- **WHEN** a logged-in user who is not a member requests an asset file address of room A7F3K9
- **THEN** the server refuses the request

### Requirement: Switch the scene

The GM SHALL set the current scene by choosing an asset from 背景 and optionally editing its caption, which defaults to the file name. Every member's scene area SHALL show the new background and the label 場景：<caption> within 2 seconds. Members who join or reconnect later SHALL see the current scene.

#### Scenario: Guided scene change

- **WHEN** the GM chooses the background with caption 夜晚的圖書館
- **THEN** every member's scene area shows that image labelled 場景：夜晚的圖書館

### Requirement: Show and hide portraits and props

The GM SHALL show an asset from 立繪 or 道具 on top of the scene for everyone, and hide it again. At most 3 portraits and 1 prop SHALL be shown at the same time; showing a fourth portrait SHALL replace the oldest one shown. Players SHALL NOT be able to show or hide assets.

#### Scenario: Show an NPC portrait

- **WHEN** the GM shows the portrait 圖書館員
- **THEN** every member sees it over the scene until the GM hides it

#### Scenario: Fourth portrait replaces the oldest

- **WHEN** portraits A, B, C are shown in that order and the GM shows D
- **THEN** B, C, D are shown


