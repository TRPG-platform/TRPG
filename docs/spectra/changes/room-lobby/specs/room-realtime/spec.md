## Purpose

Room realtime is the live connection every member of a room keeps open. The server is the only source of truth for room state; it checks permissions, applies changes, and broadcasts them to the room's members, and members who reconnect catch up to the latest state.

## ADDED Requirements

### Requirement: Room-scoped live connection

When a member opens a room page, the browser SHALL open one live connection authenticated by the user's login and subscribed only to that room. The server SHALL refuse the connection for users who are not members of the room. Events SHALL be delivered only to members of the same room.

#### Scenario: Non-member is refused

- **WHEN** a logged-in user who is not a member tries to connect to room A7F3K9
- **THEN** the server refuses the connection and the page shows 你不是這個房間的成員

#### Scenario: Events stay in their room

- **WHEN** a member of room A7F3K9 marks ready
- **THEN** members of other rooms receive no event

### Requirement: Server-authoritative state with versions

Every change to room state SHALL be sent as a request to the server, checked for permission, applied, and then broadcast with a room state version number that increases by 1 for each applied change. A browser that receives a version more than 1 above its own SHALL request the full room state.

#### Scenario: Missed event is recovered

- **WHEN** a browser at version 12 receives an event with version 14
- **THEN** it requests and displays the full room state at version 14 or later

#### Scenario: Permission checked on the server

- **WHEN** a player sends a request to change a GM-only setting
- **THEN** the server rejects it, the version does not change, and no event is broadcast

### Requirement: Online presence and reconnection

The server SHALL mark a member online while their connection is open and offline 10 seconds after it closes. During a disconnection the page SHALL show 重新連線中… and block actions; after reconnecting it SHALL load the full current room state before unblocking.

#### Scenario: Short disconnect

- **WHEN** a player's network drops for 5 seconds and returns
- **THEN** other members never see the player go offline, and the player's page shows the current state after reconnecting

#### Scenario: Long disconnect

- **WHEN** a player's connection stays closed for 10 seconds
- **THEN** other members see the player's online dot turn off


