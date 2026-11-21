## Purpose

Atmosphere effects make a player's screen react to their character's sanity, darkening as SAN falls and flickering when it is very low, to add tension to horror play. The GM can turn the effects on or off for the whole room.

## ADDED Requirements

### Requirement: Sanity-based screen effects

When the room's 特效 switch is on, each player's own screen SHALL show an effect based on their character's current SAN compared with the SAN they had when the game started. The effect SHALL apply only to that player's screen; other members, including the GM, SHALL NOT see it. The effect SHALL update within 2 seconds of a SAN change.

#### Scenario: Effect levels

- **WHEN** a player's SAN changes
- **THEN** their screen shows the effect for the new level

##### Example: effect levels with starting SAN 70

| Current SAN | Ratio to start | Effect |
|---|---|---|
| 70 | 100% | none |
| 50 | 71% | none |
| 35 | 50% | dark vignette around the screen edges |
| 14 | 20% | dark vignette plus a short flicker every 8 seconds |
| 0 | 0% | dark vignette plus flicker |

#### Scenario: Effect stays private

- **WHEN** player 波太透 reaches 20% SAN
- **THEN** only 波太透's screen flickers

### Requirement: GM effects switch

The GM SHALL turn effects on or off for the room with the 特效 switch; the default SHALL be on. Turning it off SHALL remove all effects from every player's screen within 2 seconds.

#### Scenario: Turn effects off

- **WHEN** the GM turns 特效 off while a player's screen is flickering
- **THEN** the flicker and vignette disappear on that player's screen

### Requirement: Reduced motion and readability

The flicker SHALL be skipped when the player's system requests reduced motion, keeping only the vignette. Effects SHALL NOT cover the chat input, the dice panel, or buttons, and SHALL NOT block clicks.

#### Scenario: Reduced motion

- **WHEN** a player whose system requests reduced motion reaches 20% SAN
- **THEN** their screen shows the vignette without flicker


