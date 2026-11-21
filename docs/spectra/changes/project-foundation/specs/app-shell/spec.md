## Purpose

The app shell is the shared page frame every Takoyaki page renders inside: the top navigation bar, the compact header used inside game rooms, the login redirect for protected pages, and the shared design tokens. It exists so that eight teammates building separate features produce pages that look and navigate the same.

## ADDED Requirements

### Requirement: Top navigation bar

Every page outside a game room SHALL render a top navigation bar containing the TAKOYAKI logo, four navigation items in this order — 首頁, 劇本管理, 我的角色, 教學與資源 — a notification bell icon, and the signed-in user's avatar. Clicking the logo or 首頁 SHALL navigate to the home page; each other item SHALL navigate to its own page route.

#### Scenario: Navigation items in fixed order

- **WHEN** a signed-in user opens any page outside a game room
- **THEN** the top bar shows the items 首頁, 劇本管理, 我的角色, 教學與資源 in that order, followed by the bell icon and the user's avatar

#### Scenario: Navigate between sections

- **WHEN** the user clicks 我的角色 in the top bar
- **THEN** the browser navigates to the my-characters page without a full page reload

### Requirement: Current page indicator

The navigation item that matches the current page SHALL be shown in its selected state (gold text with an underline), and all other items SHALL be shown in their normal state. Exactly one item SHALL be selected on pages that belong to a navigation section; pages that belong to no section SHALL show no selected item.

#### Scenario: Selected item follows the route

- **WHEN** the user is on the script library page
- **THEN** 劇本管理 is in the selected state and 首頁, 我的角色, 教學與資源 are in the normal state

#### Scenario: Page outside any section

- **WHEN** the user is on the join-room page
- **THEN** no navigation item is in the selected state

### Requirement: Compact game room header

Pages inside a room (room lobby and game room) SHALL replace the top navigation bar with a compact header containing a leave button on the left, the TAKOYAKI logo, the bell icon, and the user's avatar. Clicking the leave button SHALL ask for confirmation and, when confirmed, return the user to the home page.

#### Scenario: Leave a room from the header

- **WHEN** the user clicks the leave button in the compact header and confirms
- **THEN** the user is returned to the home page

#### Scenario: Cancel leaving

- **WHEN** the user clicks the leave button and then cancels the confirmation
- **THEN** the user stays on the current room page

### Requirement: Login redirect for protected pages

Every page except the home page and the login/register page SHALL require a signed-in user. A visitor who is not signed in and opens a protected page SHALL be redirected to the login page, and after a successful login SHALL be sent back to the page they originally requested.

#### Scenario: Visitor opens a protected page

- **WHEN** a visitor who is not signed in opens the my-characters page
- **THEN** the login page is shown instead

#### Scenario: Return after login

- **WHEN** that visitor then logs in successfully
- **THEN** the my-characters page is shown

### Requirement: Shared design tokens

The frontend SHALL define the colors, fonts, and corner radii from the Figma design as named design tokens in one shared location, and every feature's components SHALL reference these tokens instead of hard-coded color values. The token set SHALL include at least: page background, panel background, border, secondary text, primary text, primary purple, accent gold, success green, and failure red; the body font and the heading font; and the card radius and button radius.

#### Scenario: Token values match the design

- **WHEN** a reviewer compares the token file with docs/design/figma/README.md
- **THEN** every token listed above exists and its value equals the value in the README table

#### Scenario: No hard-coded colors in feature code

- **WHEN** the lint check runs on the frontend source
- **THEN** it reports an error for any hex color literal outside the token file


