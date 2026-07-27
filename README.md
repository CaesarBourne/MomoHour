# MoMo Hour Admin Portal

A standalone Next.js web UI for administering the MoMo Hour reward campaign
feature — everything that was previously only reachable via raw HTTP calls
(see `docus/MOMO-HOUR.md` and `docus/postman/MoMo-Hour.postman_collection.json`
at the repo root). Covers:

- **Bouquets** — view/create/edit bouquets, see which services are whitelisted
  under each, and check a bouquet's real-time live status on demand
- **Services** — the full serviceKey → bouquet whitelist, add/edit entries
- **Schedule** — create date + hour-range drop schedules (every drop is a
  fixed 60 minutes), with clear handling of time-slot conflicts, and
  enable/disable a not-yet-live slot to cancel it
- **Drops** — view the currently active drop, manually activate/end one, and
  a manual reward-trigger tool for testing
- **Rewards** — browse reward history, search by MSISDN

There is no in-portal request/response log — that would need its own DB
table, which was deliberately dropped to avoid the extra storage/writes.
Reward-engine decisions (including in-process checks like `buyAirtime`,
which never go over HTTP) are visible in the **ECW console/application
logs** instead — look for `MoMoHour rewardAsync ...` and
`MoMoHour processReward rejected: ...` lines.

This app talks directly to the GHA pod's `POST /momo-hour/*` API. It does
**not** call ECW or CIS directly.

## Running locally

```bash
cd momo-hour-portal
npm install
cp .env.local.example .env.local   # defaults to http://localhost:3000 (local GHA)
npm run dev                         # serves on http://localhost:3100
```

Requires a running GHA instance reachable at the configured base URL.

## Pointing at a different server

The base URL is **not baked in at build time** — `NEXT_PUBLIC_GHA_BASE_URL`
is only the default shown on first load. Open **Settings** in the portal to
point it at any environment (dev/uat/prod GHA base URL); the choice is saved
in the browser (`localStorage`) and reused on every request until changed.
This means a single deployed instance of this portal can administer MoMo
Hour on any environment without a rebuild.

## "Enabled/Disabled" vs "LIVE" — read this before it confuses you

The DB `status` field on bouquets/services/schedules (`ACTIVE`/`INACTIVE`) is a
**permanent whitelist flag** — it says nothing about whether a drop is
actually running right now. The portal deliberately labels it **"Enabled"/
"Disabled"** everywhere (`StatusBadge` in `src/components/ui/Badge.tsx`) so
it can't be misread as "live." The word **"LIVE"** is reserved exclusively
for the real-time drop state — the Dashboard, the Drops page, and the
"Check live status" button on each Bouquet card. A bouquet/service can sit
"Enabled" for months with no drop ever live; a payment only earns a reward
when both are true at once: its service is Enabled *and* its bouquet has a
live drop at that exact moment (see `docus/MOMO-HOUR.md` §2a).

Relatedly, the Schedule page only offers the Enable/Disable toggle for
today/upcoming slots — a past date can never self-activate again regardless
of its status, so the control is hidden there rather than left as a
do-nothing button.

## Important: there is no login screen

`GHA/src/auth/auth.middleware.ts` lists `/momo-hour` in `urlExceptions`
specifically so an external portal (this one) can call it without a
session/JWT — see `docus/MOMO-HOUR.md` §5. That means **anyone who can reach
the configured GHA base URL can fully administer MoMo Hour through this
portal** (create/activate drops, change the whitelist, etc.). This app adds
no access control of its own. Restrict who can reach it at the network/
deployment layer (VPN, IP allowlist, internal-only ingress) — do not expose
it publicly.

## Two required request rules

Every request to GHA's `/momo-hour/*` routes must (enforced globally by
`AuthMiddleware`, independent of this portal):
1. Carry a **non-empty JSON body** — list/read calls with no real params send
   a `{ "source": "momo-hour-portal" }` placeholder, exactly like the Postman
   collection does.
2. Carry a **`metadata` header**. The middleware only checks presence, but some
   downstream logging/analytics reads fields out of it, so this portal sends a
   realistic mobile-app-shaped payload (`src/lib/metadata-header.ts`) rather than
   an empty placeholder.

The API client in `src/lib/api.ts` handles both automatically; you shouldn't
need to think about this when adding a new page/call.
