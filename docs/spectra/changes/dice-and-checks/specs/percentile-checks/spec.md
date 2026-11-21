## Purpose

Percentile checks are the rule module's skill check and sanity check. The module asks the dice roller for raw d100 values, judges the success level against the character's values, applies sanity loss, and returns a generic result level plus display text for the core to show.

## ADDED Requirements

### Requirement: Skill check success levels

A skill check SHALL roll 1d100 against a target value taken from the character's skill or attribute final value. The result level SHALL be decided as below, checked from top to bottom. The module SHALL return a generic level (best, positive, negative, worst) plus Chinese display text; the core SHALL style the result only by the generic level.

| Condition | Display text | Generic level |
|---|---|---|
| roll = 1 | 大成功 | best |
| roll ≥ 96 and target < 50, or roll = 100 | 大失敗 | worst |
| roll ≤ floor(target / 5) | 極限成功 | positive |
| roll ≤ floor(target / 2) | 困難成功 | positive |
| roll ≤ target | 成功 | positive |
| otherwise | 失敗 | negative |

#### Scenario: Judge results

- **WHEN** a skill check is resolved
- **THEN** the level follows the table

##### Example: skill check results

| Target | Roll | Result |
|---|---|---|
| 75 | 34 | 成功 |
| 75 | 15 | 極限成功 |
| 75 | 37 | 困難成功 |
| 60 | 88 | 失敗 |
| 40 | 97 | 大失敗 |
| 60 | 97 | 失敗 |
| 60 | 100 | 大失敗 |
| 10 | 1 | 大成功 |

### Requirement: Bonus and penalty dice

A skill check SHALL accept up to 2 bonus dice or up to 2 penalty dice, not both. Each bonus or penalty die SHALL roll an extra tens digit (0–9); the check SHALL use the lowest tens digit for bonus or the highest for penalty, combined with the single units die. A tens digit of 0 with units 0 SHALL count as 100.

#### Scenario: One bonus die

- **WHEN** a check with one bonus die rolls tens digits 7 and 2 and units digit 4
- **THEN** the roll used is 24

#### Scenario: One penalty die

- **WHEN** a check with one penalty die rolls tens digits 0 and 3 and units digit 0
- **THEN** the candidates are 100 and 30, and the roll used is 100

### Requirement: Skill check panel

The dice panel SHALL have no tabs. From top to bottom it SHALL contain: a skill dropdown that shows each skill of the viewer's own character with its final value, bonus or penalty dice and open or hidden choices, the 進行判定 button, a dice expression input with a 擲骰 button for free rolls, and the 擲骰紀錄 list. The GM SHALL request a skill check from a player through that player's menu in the player list, which shows the player a prompt to roll. The result SHALL be recorded in 擲骰紀錄 as 1D100 ≦ target → roll with a green label for positive or best levels and a red label for negative or worst levels.

#### Scenario: Design sample record

- **WHEN** a player checks 偵查 with final value 75 and rolls 34
- **THEN** 擲骰紀錄 shows 1D100 ≦ 75 → 34 with a green 成功 label

#### Scenario: GM requests a check

- **WHEN** the GM opens 斯卓貝瑞's menu in the player list and requests 聆聽
- **THEN** 斯卓貝瑞 sees a prompt 請進行 聆聽 檢定 with the 進行判定 button ready

#### Scenario: Free roll

- **WHEN** a player types 1d8+1 in the expression input and presses 擲骰
- **THEN** the result appears in 擲骰紀錄 and in the chat's Dice tab

### Requirement: Sanity check

Only the GM SHALL start a sanity check, by choosing a player from the player list menu and entering a loss expression pair success/failure (for example 1/1d6). The chosen player SHALL see the prompt 請進行理智檢定 and press 擲骰; the server SHALL then roll 1d100 against the character's current SAN: success when roll ≤ current SAN, failure otherwise, with roll 100 always failure. The server SHALL roll the matching loss expression, subtract it from current SAN (not below 0), save the character, and broadcast the new SAN. If the loss in one check is 5 or more, the result SHALL include 需進行 INT 檢定判定是否陷入暫時性瘋狂. If SAN reaches 0, the result SHALL include 永久性瘋狂 and the character's insanity state SHALL become 永久性瘋狂.

#### Scenario: Sanity results

- **WHEN** a sanity check is resolved
- **THEN** SAN changes as follows

##### Example: sanity checks

| Current SAN | Expression | Roll | Loss rolled | New SAN | Extra |
|---|---|---|---|---|---|
| 65 | 1/1d6 | 40 | 1 | 64 | none |
| 65 | 1/1d6 | 80 | 4 | 61 | none |
| 65 | 0/1d10 | 90 | 7 | 58 | INT check prompt |
| 3 | 1/1d6 | 50 | 5 | 0 | 永久性瘋狂, INT check prompt |

#### Scenario: Player cannot start a sanity check

- **WHEN** a player sends a request to start a sanity check
- **THEN** the server rejects it and no roll is made

### Requirement: Check visibility and authority

Checks SHALL use the server's stored character values, not values sent by the browser. Players SHALL make skill checks only for their own characters and SHALL NOT start sanity checks; the GM SHALL be able to request checks for any character in the room. Hidden checks SHALL follow the dice-roller hidden roll rule.

#### Scenario: Forged target value

- **WHEN** a player's request claims 偵查 target 99 while the stored final value is 75
- **THEN** the server judges against 75


