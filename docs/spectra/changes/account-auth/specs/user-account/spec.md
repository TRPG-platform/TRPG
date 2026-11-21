## Purpose

User accounts identify who owns each script, character, and room. This capability covers registering, logging in and out, keeping the login across page reloads, renaming the display name, and deleting the account.

## ADDED Requirements

### Requirement: Register an account

A visitor SHALL be able to register with an account name, a display name, a password, and a password confirmation. The account name SHALL be 4–20 characters of letters, digits, or underscore and SHALL be unique (case-insensitive). The password SHALL be at least 8 characters. The display name SHALL be 1–20 characters. After a successful registration the visitor SHALL be logged in and sent to the home page.

#### Scenario: Successful registration

- **WHEN** a visitor submits account name ling_01, display name 翎, and two matching 8-character passwords
- **THEN** the account is created, the visitor is logged in, and the home page shows 翎's avatar in the top bar

#### Scenario: Rejected registration input

- **WHEN** a visitor submits a registration form that breaks a rule
- **THEN** the form stays open, the password fields are cleared, and an error message appears under the offending field

##### Example: registration errors

| Input | Error shown |
|---|---|
| account name abc | 帳號需為 4–20 個英數字或底線 |
| account name LING_01 when ling_01 exists | 此帳號已被使用 |
| password 1234567 | 密碼至少 8 個字元 |
| confirmation differs from password | 兩次密碼不一致 |

### Requirement: Log in

A registered user SHALL be able to log in with account name and password on the login page. On failure the page SHALL show one generic message that does not reveal whether the account name exists.

#### Scenario: Successful login

- **WHEN** the user enters a correct account name and password and clicks 立即登入
- **THEN** the user is logged in and sent to the page they originally requested, or to the home page if none

#### Scenario: Wrong credentials

- **WHEN** the user enters an unknown account name or a wrong password
- **THEN** the page shows 帳號或密碼錯誤 and the password field is cleared

### Requirement: Login persists until logout or expiry

A successful login SHALL stay valid across page reloads and browser tab closes for 7 days from the last visit. Passwords SHALL be stored only as a salted hash on the server, and the login token SHALL NOT be readable by page scripts.

#### Scenario: Reload keeps the login

- **WHEN** a logged-in user reloads the my-characters page
- **THEN** the page loads without asking the user to log in again

#### Scenario: Expired login

- **WHEN** a user returns 8 days after their last visit
- **THEN** opening a protected page redirects to the login page

### Requirement: Log out

The avatar in the top bar SHALL open a menu containing 帳號設定 and 登出. Choosing 登出 SHALL end the login on the server and send the user to the home page.

#### Scenario: Logout ends the session

- **WHEN** the user chooses 登出 and then presses the browser back button to a protected page
- **THEN** the login page is shown

### Requirement: Account settings

The account settings page SHALL let the user change the display name (same 1–20 character rule) and delete the account. Deleting SHALL require typing the account name to confirm, SHALL log the user out, and SHALL remove the user's characters and scripts; rooms where the user is GM SHALL be ended.

#### Scenario: Rename

- **WHEN** the user changes the display name from 翎 to 玲 and saves
- **THEN** the top bar and the user's future chat messages show 玲

#### Scenario: Delete requires confirmation

- **WHEN** the user clicks 刪除帳號 but types a different account name in the confirmation box
- **THEN** the delete button stays disabled and nothing is deleted


