## Purpose

The dice roller is the rule-independent core for rolling dice. It parses dice expressions, rolls on the server with a secure random source, records every roll, and shows results publicly or only to the roller and the GM.

## ADDED Requirements

### Requirement: Dice expression syntax

The server SHALL accept expressions made of dice terms NdM (N from 1 to 50, M from 2 to 1000, N defaults to 1), an optional keep-highest suffix khK or keep-lowest suffix klK (1 ≤ K ≤ N), and integer constants, joined by + or −. Letters SHALL be case-insensitive and spaces ignored. Any other input SHALL be rejected with a message naming the problem.

#### Scenario: Parse expressions

- **WHEN** a member submits an expression
- **THEN** the server accepts or rejects it as follows

##### Example: expressions

| Expression | Result |
|---|---|
| 1d100 | accepted |
| 3D6 + 2 | accepted |
| 4d6kh3 | accepted, sums the highest 3 dice |
| d20 | accepted as 1d20 |
| 51d6 | rejected: 單次最多擲 50 顆骰子 |
| 1d1 | rejected: 骰子面數需介於 2 到 1000 |
| 2d6kh3 | rejected: 保留數量不能超過骰子數 |
| 1d6*2 | rejected: 算式格式錯誤 |

### Requirement: Server-side rolling

All rolls SHALL be generated on the server with a cryptographically secure random source. The browser SHALL send only the expression and visibility, and SHALL display the result the server returns. The random source SHALL be injectable so tests use a fixed seed, and production SHALL refuse to start if a fixed seed is configured.

#### Scenario: Fixed seed in tests

- **WHEN** the test suite rolls 3d6 twice with the same fixed seed
- **THEN** both rolls return the same individual dice and total

#### Scenario: Seed forbidden in production

- **WHEN** the server starts in production mode with a fixed seed configured
- **THEN** it exits with an error naming the seed setting

### Requirement: Roll record

Every roll SHALL be stored with roller, room, expression, each die's raw value, kept dice, total, visibility, purpose label (free roll, skill check, sanity check), and time. Each roll SHALL appear as a dice message in the chat's Dice tab and in the dice panel's 擲骰紀錄 list, newest first, showing the expression, the total, and the result label when there is one.

#### Scenario: Roll appears in two places

- **WHEN** a player rolls 3d6+2 and gets 4, 2, 6
- **THEN** the Dice tab and 擲骰紀錄 both show 3d6+2 → 14 with the dice 4, 2, 6

### Requirement: Open and hidden rolls

A roll SHALL be open by default. A hidden roll SHALL be delivered by the server only to the roller and the GM; other members SHALL receive only a notice 某某 進行了一次暗骰 with no expression, dice, or total.

#### Scenario: Hidden roll by the GM

- **WHEN** the GM makes a hidden 1d100 roll
- **THEN** only the GM sees the result, and every player's Dice tab shows 投沒透 進行了一次暗骰 with no numbers in the data their browser received


