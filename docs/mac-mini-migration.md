# Move Phone Farm to another Mac mini

The code is only one part of this installation. A fresh clone does not include
registered phones, database schedules/history, uploads, Apple signing keys, or
USB trust. Complete the steps below from Terminal in a graphical login session
on each Mac. Keep the old Mac available until the new one passes the checklist.

## Next steps and what is still missing

- [ ] Make a final database backup and privately transfer configuration/device
  state from the old Mac (section 1). Git does not carry these files.
- [ ] Install Xcode, Node 22+, PostgreSQL, and the pinned XCUITest driver on the
  new Mac (section 2). Rebuild dependencies and WDA there.
- [ ] Restore schedules/history and any uploaded media before starting a worker
  (section 3). A database migration creates schema; it does not recover data.
- [ ] Sign in to Xcode, restore or create an Apple Development signing identity,
  pair each iPhone, and build WDA (section 4).
- [ ] Verify the dashboard and phone control, then enable the worker and install
  startup agents with the new checkout path (sections 5–6).
- [ ] Check the Instagram account has Meta AI and the expected Reels/Search UI
  before enabling contextual comments or topic engagement. These flows still
  need a physical-device smoke test on the new host; automated tests cannot
  confirm the account-specific Instagram UI.
- [ ] If you need a session with no likes at all, add a separate comment-like
  control first. Automatic comment browsing can currently like comments even
  when Reel likes and comment posting are disabled.

At the October 16, 2026 handoff, this checkout has `.env`, `devices.json`, and a
local Appium driver. The default `.scheduler-data/` and `data/leads/state/`
directories are absent. Check configured paths before concluding there is no
media or contact history to move. No database export or private transfer is
performed by a Git push. The new Mac's dependencies, signing, pairing, restore,
and live checks remain to be done on that machine.

## 1. On the old Mac: stop writes and save local state

Stop running tasks from Activity and wait for them to finish. Quit any manually
started worker/web/WDA/Appium processes. If using the supplied launch agents,
unload them so KeepAlive cannot restart them during the final backup:

```sh
for svc in worker web wda-service appium; do
  launchctl bootout "gui/$(id -u)/com.phone-farm.$svc" 2>/dev/null || true
done
```

Leave PostgreSQL running for the export. Do not run workers on both Macs during
the move. If a job was interrupted, inspect its outcome before resuming it:
retrying a post, DM, or connection request may repeat an external action.

Privately copy the following to an encrypted disk or another private transfer
location outside the repository:

| State | What to transfer |
| --- | --- |
| `.env` and `.env.devices` if present | Database credentials, signing settings, plugin configuration, optional legacy passcodes. |
| `devices.json` or `DEVICES_CONFIG_PATH` | Device UDIDs, passcodes, ports, coordinate overrides, accounts, and disabled flags. |
| PostgreSQL dump | All schemas: `scheduler`, `pgboss`, and `drizzle`, including schedules, job state, history, and migration ledger. |
| `.scheduler-data/` or `SCHEDULER_DATA_DIR` | Uploaded media referenced by database assets. Preserve its internal paths. |
| `data/leads/` or `LEADS_DIR` | Local lead lists and especially `state/`, which prevents repeat DMs. |
| `data/linkedin/` or `LINKEDIN_LEADS_DIR` | Local CSVs/contact state and any captures you want to retain. |
| `data/hinge/`, optional logs | Shadow recordings and diagnostic history, if needed. |
| External plugin/auth modules | Locally installed packages or modules referenced in `.env` that are not shipped by this repository. |

Inspect `.env` locally for absolute/custom paths. Transfer those directories
as well; an absent default directory does not establish that its configured
replacement is empty. Never commit these backups or credentials.

For the local Homebrew database, use a client at least as new as the source
server. The existing host has a PostgreSQL 17 client. In the example below,
replace the host, port, user, and database with your `.env` values; `-W` prompts
for the database password without putting it in the command:

```sh
export PATH="$(brew --prefix postgresql@17)/bin:$PATH"
mkdir -p "$HOME/phone-farm-transfer"
chmod 700 "$HOME/phone-farm-transfer"
pg_dump -h 127.0.0.1 -p 5432 -U phone_farm -d phone_farm -W \
  --format=custom --no-owner --no-acl \
  --file="$HOME/phone-farm-transfer/phone-farm.dump"
pg_restore --list "$HOME/phone-farm-transfer/phone-farm.dump" > /dev/null
chmod 600 "$HOME/phone-farm-transfer/phone-farm.dump"
```

Confirm both commands succeed before transferring the dump. Keep private files
with it. If the database runs in the bundled Docker service instead, export
from the repository with:

```sh
docker compose exec -T postgres sh -c \
  'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc --no-owner --no-acl' \
  > "$HOME/phone-farm-transfer/phone-farm.dump"
```

Then validate the archive and restrict its permissions as above. A Docker
volume is not part of a clone either.

## 2. On the new Mac: install tools and clone

Install Homebrew if needed. Install the full Xcode, open it, finish its first
launch setup, and sign in under Settings → Accounts using the same developer
team. Select its actual application path (adjust if Xcode has another name):

```sh
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
xcodebuild -runFirstLaunch
xcode-select -p
```

For a local PostgreSQL 17 installation:

```sh
brew install node@22 postgresql@17
export PATH="$(brew --prefix node@22)/bin:$(brew --prefix postgresql@17)/bin:$PATH"
node --version
brew services start postgresql@17
pg_isready -h 127.0.0.1
mkdir -p "$HOME/Developer"
git clone https://github.com/Jackcar/Kevs-IOS-Agents.git "$HOME/Developer/Kevs-IOS-Agents"
cd "$HOME/Developer/Kevs-IOS-Agents"
git remote add upstream https://github.com/kevinbadi/Kevs-IOS-Agents.git
npm ci
npm run appium:install-driver
npm run check
```

Authenticate Git with an account that can access the repository if prompted.
Clone the `Jackcar` fork to get the committed local changes. `origin` is your
fork for future pushes; `upstream` tracks the original project's updates.
Put the Node and PostgreSQL bin paths in your shell profile for future terminals.
Use the source database's major version or a newer supported version when
restoring; do not downgrade a PostgreSQL 17 dump into PostgreSQL 15. Use just
one database server on port 5432. If you choose the bundled Docker PostgreSQL
17 instead, install/start Docker, configure `.env`, and use `npm run db:up`
instead of starting a Homebrew database.

Do not copy `node_modules/`, `.appium2/`, `.wda/`, Xcode DerivedData, or old
LaunchAgents. Reinstall/rebuild them. `.wda/` contains host-specific locks and
sockets. `npm ci` also installs the native macOS OCR dependency for this Mac.

The existing `deploy/setup-mac-mini.sh` is a fresh-host convenience helper,
not the migration procedure: it installs PostgreSQL 15, assumes Apple silicon
Homebrew paths, sources `.env` as shell code, and immediately starts all four
services. Follow this guide for restoring an existing installation and delaying
worker startup until verification is complete.

## 3. Restore configuration, media, and database

Restore the private files from section 1 into the new checkout, or into the
custom directories configured in `.env`. Preserve `devices.json` rather than
registering every phone again; its overrides and account settings matter.

```sh
chmod 600 .env devices.json
# Only if this optional file was transferred:
# chmod 600 .env.devices
```

Review `.env` in an editor. Set these to the new host's actual values:

- `DATABASE_URL` and, for Docker, `POSTGRES_PASSWORD`/user/database/port.
- `XCODE_DEVELOPER_DIR`: explicitly set the path printed by `xcode-select -p`.
  WDA currently defaults to `/Applications/Xcode_26.2.app/Contents/Developer`,
  so merely selecting `/Applications/Xcode.app` is insufficient.
- `XCODE_ORG_ID`, `WDA_BUNDLE_ID`, and `IOS_PLATFORM_VERSION` for your team and
  phones. Retain the existing bundle ID if the same team can sign it.
- `DEVICES_CONFIG_PATH`, `SCHEDULER_DATA_DIR`, `LEADS_DIR`,
  `LINKEDIN_LEADS_DIR`, `XCUITEST_DRIVER_PATH`, `WDA_PROJECT_PATH`, and
  `WDA_BOOTSTRAP_PATH` if present: replace old-machine absolute paths or remove
  unnecessary overrides. Uploaded asset paths resolve relative to
  `SCHEDULER_DATA_DIR`, so keep the restored directory structure intact.
- `PHONE_FARM_PLUGINS` and `PHONE_FARM_AUTH_PLUGIN`: reinstall their modules.
  Keep `WEB_HOST=127.0.0.1` for the initial local check.

Create a new empty local database and role, if they do not already exist. These
commands assume the default `phone_farm` user/database; choose the same password
as the new `.env` when prompted:

```sh
createuser -h 127.0.0.1 --pwprompt phone_farm
createdb -h 127.0.0.1 --owner=phone_farm phone_farm
pg_restore -h 127.0.0.1 -p 5432 -U phone_farm -d phone_farm -W \
  --no-owner --no-acl --exit-on-error \
  "$HOME/phone-farm-transfer/phone-farm.dump"
npm run db:migrate
```

Restore into an empty database **before** migrations; do not restore over a
running installation. If using Docker, `db:up` creates the role/database from
`.env`, so skip `createuser`/`createdb` and restore into that empty database.
If continuing to use an unchanged external database, skip dump restoration and
point `DATABASE_URL` at it; still move local media/state and stop the old worker.
A deliberate clean installation can skip the dump, but loses prior
schedules/history and needs device registration if no registry was transferred.

## 4. Pair phones and rebuild signed WebDriverAgent

1. In Xcode Settings → Accounts, select the developer team and ensure an
   **Apple Development** signing certificate with its private key exists.
   Import an exported `.p12` through Keychain Access if reusing an identity,
   or let Xcode create one for this Mac. A `.cer` without its private key
   cannot sign. Do not revoke the old Mac's certificate just to move hosts.
2. Plug in each iPhone, unlock it, accept **Trust This Computer**, and confirm
   it appears connected in Xcode → Window → Devices and Simulators. Enable
   Developer Mode on the phone if required and wait for Xcode preparation.
3. From Terminal in the logged-in GUI session, verify and build:

   ```sh
   xcrun xctrace list devices
   security find-identity -v -p codesigning
   npm run wda:prepare -- --all
   ```

   Use `npm run wda:prepare -- --udid <udid>` for one phone or when there is no
   restored registry yet. WDA preparation applies the repository patches,
   including media import and sessionless device controls, before signing.
4. Unlock the phone for its first WDA launch. Complete any developer trust or
   permission prompts. Keep the login keychain unlocked for signing.

## 5. Verify before starting automation

Start these in three separate terminals, each from the new checkout with the
Node PATH configured:

```sh
npm run appium
npm run wda:service
npm run web
```

In another terminal:

```sh
curl --fail http://127.0.0.1:3000/health
curl --fail http://127.0.0.1:4725/status
curl --fail --unix-socket .wda/wda-service.sock http://localhost/health
```

Use the configured ports if changed. The web health endpoint lists plugins;
also inspect the WDA health response for each device's readiness.

- [ ] Open <http://127.0.0.1:3000> and confirm the restored phones, schedules,
  execution history, accounts, and calibration are present.
- [ ] Check live video, tap, swipe, and unlock for every active phone.
- [ ] Confirm uploaded assets exist, and lead contact state still shows prior
  contacts, before enabling posts or DMs.
- [ ] Review due/queued tasks and pause unwanted schedules before starting
  the worker. Restored schedules can become due as soon as the worker starts.
- [ ] Confirm Instagram is signed into the intended accounts. Check About this
  reel, Meta AI, and Search → Reels if using the new contextual/topic flows.

Then run `npm run worker` in a fourth terminal. Run one supervised short session
with Reel likes and comment posting disabled first. Automatic comment browsing
can still like comments; the current forms have no separate switch for this.
Watch Activity and logs before enabling normal recurring work. The old Mac's
worker should remain stopped.

## 6. Enable startup on the new Mac

After the manual check, stop the four foreground processes. Generate new
LaunchAgents from this checkout so the home directory, Node path, and repository
path match the new Mac. Run from the repository root with Node on PATH:

```sh
mkdir -p "$HOME/Library/LaunchAgents" "$PWD/logs"
for svc in appium wda-service web worker; do
  sed -e "s#__REPO__#$PWD#g" \
      -e "s#__HOME__#$HOME#g" \
      -e "s#__NODE_BIN__#$(dirname "$(command -v node)")#g" \
      "deploy/launchd/com.phone-farm.$svc.plist" \
      > "$HOME/Library/LaunchAgents/com.phone-farm.$svc.plist"
  plutil -lint "$HOME/Library/LaunchAgents/com.phone-farm.$svc.plist"
  launchctl bootout "gui/$(id -u)/com.phone-farm.$svc" 2>/dev/null || true
  launchctl bootstrap "gui/$(id -u)" \
    "$HOME/Library/LaunchAgents/com.phone-farm.$svc.plist"
done
```

The templates assume ordinary paths without XML/sed special characters. If
your checkout path contains `&`, `#`, or `<`, edit the plist values with a
plist-aware editor instead of this substitution. Check `logs/*.log` and repeat
the health checks. These are per-user GUI agents: log into the intended macOS
account after reboot; they do not start at the FileVault unlock screen.
Configure the Mac's Energy settings to prevent system sleep while running the
farm and enable restart after power failure if desired. Reboot once and verify
PostgreSQL, all four agents, and the phone connections recover. Retain the old
Mac and private backup until this check succeeds.
