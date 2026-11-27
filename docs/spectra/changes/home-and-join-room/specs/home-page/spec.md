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

Below the hero, the home page SHALL show a section titled 近期開團 listing rooms whose status is waiting, whose scheduled start time is in the future, and whose GM marked the room as public. The section SHALL show every matching room with no upper limit, in one row that scrolls horizontally. A sort menu next to the title SHALL offer two orders: 遊玩時間 (scheduled start time, soonest first; the default) and 房間建立時間 (room creation time, newest first). Each card SHALL show the cover image, the script title, the rule label, play style and player range, the scheduled date and time, the recruiting count as joined/max, and one tag. When no room matches, the section SHALL show 目前沒有開團，來當第一個開團的人吧！ with the 建立房間 button.

#### Scenario: Cards sorted by start time

- **WHEN** three public waiting rooms are scheduled and the sort menu shows 遊玩時間
- **THEN** the cards appear soonest first

##### Example: sort order

- **GIVEN** rooms 洋詭異人館 (11/11 20:00), 失落的文明 (11/12 20:00), 霧都。追跡。 (11/10 20:00), and today is 11/09
- **WHEN** the home page loads
- **THEN** the cards appear in the order 霧都。追跡。, 洋詭異人館, 失落的文明

#### Scenario: Sort by room creation time

- **WHEN** the user picks 房間建立時間 in the sort menu
- **THEN** the most recently created room appears first

##### Example: creation order

- **GIVEN** rooms 洋詭異人館 (created 11/05), 失落的文明 (created 11/08), 霧都。追跡。 (created 11/03), all scheduled in the future
- **WHEN** the user picks 房間建立時間
- **THEN** the cards appear in the order 失落的文明, 洋詭異人館, 霧都。追跡。

#### Scenario: No upper limit

- **WHEN** seven public waiting rooms are scheduled
- **THEN** all seven cards are shown in one row and the user can scroll right to see the ones beyond the screen width

#### Scenario: Full or private rooms are hidden

- **WHEN** a room is private, or its start time has passed, or its status is playing
- **THEN** it does not appear in 近期開團

#### Scenario: Open a card

- **WHEN** a logged-in user clicks a card whose room still has a free seat
- **THEN** the user joins that room exactly as if they had entered its room code


