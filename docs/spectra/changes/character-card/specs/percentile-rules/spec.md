## Purpose

The percentile rules module defines the character fields and derived values for the first rule system Takoyaki supports, a percentile (d100) investigation-horror ruleset. All derived values are computed on the server; the browser never writes them back.

## ADDED Requirements

### Requirement: Attribute difficulty values

The module SHALL define nine attributes — STR, CON, DEX, APP, POW, INT, SIZ, EDU, LUCK — each an integer from 1 to 99, stored as an initial value plus an adjustment. For each attribute the current value SHALL be initial plus adjustment, the hard value SHALL be floor(current / 2), and the extreme value SHALL be floor(current / 5).

#### Scenario: Hard and extreme values

- **WHEN** an attribute's current value is set
- **THEN** its hard and extreme values are computed by the server

##### Example: attribute values

| Initial | Adjustment | Current | Hard | Extreme |
|---|---|---|---|---|
| 45 | 0 | 45 | 22 | 9 |
| 70 | 0 | 70 | 35 | 14 |
| 50 | -5 | 45 | 22 | 9 |
| 99 | 0 | 99 | 49 | 19 |

#### Scenario: Out-of-range attribute

- **WHEN** a save would make an attribute's current value 0 or 100
- **THEN** the server rejects the save with 屬性值需介於 1 到 99

### Requirement: Derived status values

The server SHALL compute: HP maximum = floor((CON + SIZ) / 10); MP maximum = floor(POW / 5); SAN starting value = POW; SAN maximum = 99 minus the character's 克蘇魯神話 skill value; MOV, Build, and Damage Bonus from the tables below. Current HP, MP, SAN, and LUCK SHALL be clamped between 0 and their maximum.

#### Scenario: Status maximums

- **WHEN** the attributes change
- **THEN** the maximums are recomputed

##### Example: design sample 沈映月

- **GIVEN** STR 45, CON 60, DEX 70, POW 65, SIZ 50, age 28, 克蘇魯神話 0
- **WHEN** the server computes derived values
- **THEN** HP max is 11, MP max is 13, SAN max is 99, Build is 0, Damage Bonus is 0, MOV is 8

##### Example: Build and Damage Bonus by STR+SIZ

| STR+SIZ | Damage Bonus | Build |
|---|---|---|
| 2–64 | -2 | -2 |
| 65–84 | -1 | -1 |
| 85–124 | 0 | 0 |
| 125–164 | +1D4 | 1 |
| 165–204 | +1D6 | 2 |

##### Example: MOV

| Condition | MOV |
|---|---|
| DEX < SIZ and STR < SIZ | 7 |
| DEX > SIZ and STR > SIZ | 9 |
| otherwise | 8 |
| age 40–49 | minus 1 |
| age 50–59 | minus 2 |

#### Scenario: Clamp current HP

- **WHEN** a request sets current HP to 15 while HP max is 11
- **THEN** current HP is stored as 11

### Requirement: Skill point budgets

The server SHALL compute occupation skill points from the occupation's formula and interest skill points = INT × 2. Occupation formulas SHALL be stored as data in the occupation list (for example EDU × 2 + max(APP, DEX) × 2), not hard-coded per page. The sheet SHALL show points used / points available for both budgets, and saving SHALL be refused when either used total exceeds its budget.

#### Scenario: Design sample budgets

- **WHEN** the musician occupation (EDU × 2 + max(APP, DEX) × 2) is chosen with EDU 70, APP 75, DEX 70, INT 80
- **THEN** occupation points are 290 and interest points are 160

#### Scenario: Over budget

- **WHEN** a save would spend 300 occupation points out of 290
- **THEN** the server rejects the save with 職業點數超出上限

### Requirement: Skill final values

Each skill SHALL have a base value, occupation points, interest points, and growth points. The final value SHALL be base + occupation + interest + growth, capped at 99, with half = floor(final / 2) and fifth = floor(final / 5). The 閃避 base SHALL be floor(DEX / 2) and the 母語 base SHALL be EDU; all other bases come from the skill list data.

#### Scenario: Skill values

- **WHEN** skill points change
- **THEN** final, half, and fifth values are recomputed

##### Example: skill rows from the design

| Skill | Base | Occupation | Interest | Final | ½ | ⅕ |
|---|---|---|---|---|---|---|
| 魅惑 | 15 | 30 | 0 | 45 | 22 | 9 |
| 心理學 | 10 | 40 | 0 | 50 | 25 | 10 |
| 母語（中文） | 70 | 0 | 0 | 70 | 35 | 14 |
| 手槍 | 20 | 0 | 10 | 30 | 15 | 6 |

### Requirement: Content and naming restrictions

The module SHALL display the rule system with the labels used in the Figma design (CoC 7e, CoC 6e, CoC 5e), as the team decided on 2026-11-21. The module's skill list, occupation list, and on-screen text SHALL NOT include the publisher's logos or verbatim rulebook paragraphs or tables; skill and occupation descriptions SHALL be written by the team.

#### Scenario: Rule label shown

- **WHEN** a character uses the 7th edition rules
- **THEN** the character sheet shows the label CoC 7e

#### Scenario: No copied rulebook text

- **WHEN** a reviewer compares the skill and occupation data files with the rulebook
- **THEN** no paragraph or table is copied verbatim and no publisher logo is included


