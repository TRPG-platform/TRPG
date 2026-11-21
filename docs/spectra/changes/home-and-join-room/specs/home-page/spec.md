## Purpose

The home page is the first screen of Takoyaki. It introduces the site, offers the two main entry points — creating a room and finding a game — and lists upcoming games that are recruiting players.

## ADDED Requirements

### Requirement: Hero and entry buttons

The home page SHALL show the headline 讓每一場冒險，都有屬於他的舞台。, the subtitle describing the site, and two buttons: 建立房間 and 搜尋團務. 建立房間 SHALL open the create-room flow owned by room-lobby; 搜尋團務 SHALL open the join-room page. A visitor who is not logged in and clicks either button SHALL be sent to the login page first.

#### Scenario: Create room entry

- **WHEN** a logged-in user clicks 建立房間
- **THEN** the create-room flow opens

#### Scenario: Visitor clicks an entry button

- **WHEN** a visitor who is not logged in clicks 搜尋團務
- **THEN** the login page is shown, and after login the join-room page opens

### Requirement: Upcoming recruiting games

Below the hero, the home page SHALL show a section titled 近期開團 listing rooms whose status is waiting, whose scheduled start time is in the future, and whose GM marked the room as public. The list SHALL be sorted by scheduled start time, soonest first, and SHALL show at most 4 cards. Each card SHALL show the cover image, the script title, the rule label, play style and player range, the scheduled date and time, the recruiting count as joined/max, and one tag. When no room matches, the section SHALL show 目前沒有開團，來當第一個開團的人吧！ with the 建立房間 button.

#### Scenario: Cards sorted by start time

- **WHEN** three public waiting rooms are scheduled
- **THEN** the cards appear soonest first

##### Example: sort order

- **GIVEN** rooms 洋詭異人館 (11/11 20:00), 失落的文明 (11/12 20:00), 霧都。追跡。 (11/10 20:00), and today is 11/09
- **WHEN** the home page loads
- **THEN** the cards appear in the order 霧都。追跡。, 洋詭異人館, 失落的文明

#### Scenario: Full or private rooms are hidden

- **WHEN** a room is private, or its start time has passed, or its status is playing
- **THEN** it does not appear in 近期開團

#### Scenario: Open a card

- **WHEN** a logged-in user clicks a card whose room still has a free seat
- **THEN** the user joins that room exactly as if they had entered its room code


