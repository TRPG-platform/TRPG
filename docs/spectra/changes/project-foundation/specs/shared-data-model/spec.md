## Purpose

The shared data model defines the User, Script, Character, Room, and Message data shapes that the frontend and backend both import from one shared folder, plus a mock data source for frontend work before the backend exists. It exists so that features built in parallel by different teammates exchange data in the same format.

## ADDED Requirements

### Requirement: Single shared type definitions

The User, Script, Character, Room, and Message types SHALL be defined once in the shared types folder and imported by both the frontend and the backend. Neither the frontend nor the backend SHALL redefine these types locally.

#### Scenario: Both sides import the same type

- **WHEN** a field is added to the Room type in the shared folder
- **THEN** both the frontend build and the backend build see the new field without any other file being changed

#### Scenario: Local redefinition is rejected

- **WHEN** a teammate declares a second type named Room inside the frontend folder
- **THEN** the lint check reports an error pointing to the shared Room type

### Requirement: Core entity fields

Each shared type SHALL contain at least the fields below. Identifiers SHALL be strings; timestamps SHALL be ISO 8601 strings.

| Type | Required fields |
|---|---|
| User | id, displayName, avatarUrl (nullable), createdAt |
| Script | id, ownerId, title, coverUrl (nullable), ruleSystem, playerMin, playerMax, sceneCount, estimatedHoursMin (nullable), estimatedHoursMax (nullable), tags, synopsis, status (draft / in-progress / completed), updatedAt |
| Character | id, ownerId, name, occupation, portraitUrl (nullable), ruleSystem, ruleData, tags, updatedAt |
| Room | id, roomCode, gmId, scriptId, ruleSystem, maxPlayers, scheduledAt (nullable), status (waiting / playing / ended), settings, members |
| Message | id, roomId, senderId, channel (main / whisper / gm-notice / dice), recipientIds (empty for public), body, createdAt, editedAt (nullable), deleted |

#### Scenario: Room code format

- **WHEN** a Room object is created
- **THEN** its roomCode is 6 characters long and uses only uppercase letters A–Z and digits 0–9

##### Example: room codes

| roomCode | Valid | Notes |
|---|---|---|
| A7F3K9 | yes | design sample |
| a7f3k9 | no | lowercase |
| A7F3K | no | 5 characters |

#### Scenario: Message visibility fields

- **WHEN** a Message is a whisper to one player
- **THEN** its channel is whisper and its recipientIds contains exactly that player's id

### Requirement: Rule-specific data stays in ruleData

The Character type SHALL keep the generic fields above separate from rule-specific values. Rule-specific values (for example attributes, HP, SAN, skills) SHALL be stored only inside the ruleData field, whose shape is selected by ruleSystem. The generic fields SHALL NOT contain rule-specific names.

#### Scenario: Percentile rule character

- **WHEN** a character uses the percentile rule system
- **THEN** its HP, SAN, attributes, and skills are found inside ruleData, and the top-level Character fields contain none of them

### Requirement: Switchable mock data source

The frontend SHALL read all data through one data-access layer that can be switched between a mock source and the real API by a single configuration value. The mock source SHALL return the sample content shown in the Figma design (for example the script 夜行的圖書館, the character 斯卓貝瑞, and the room code A7F3K9).

#### Scenario: Frontend runs without a backend

- **WHEN** the data source is set to mock and the backend is not running
- **THEN** every page loads and shows the design's sample content without network errors

#### Scenario: Switch to the real API

- **WHEN** the data source is set to api
- **THEN** the same pages request their data from the backend instead of the mock source


