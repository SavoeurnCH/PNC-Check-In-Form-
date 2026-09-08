# PNC & PSS Visitor Check-In — API

Node.js (Express 5) + MySQL (Knex) backend for the
[Vue frontend](../README.md). Built to the exact contract the frontend
already calls — see [../docs/BACKEND_API_TODO.md](../docs/BACKEND_API_TODO.md)
for the full spec this was built against.

## Setup

```bash
cd server
npm install
cp .env.example .env      # edit DB credentials/JWT secret if needed
npm run migrate
npm run seed               # creates a dev admin login, see below
npm run dev                 # http://localhost:8000
```

Requires a running MySQL-compatible server (MySQL 8 or MariaDB 10.4+) and a
database matching `DB_NAME` in `.env` (create it manually — migrations
create tables, not the database itself):

```sql
CREATE DATABASE pnc_visitor_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Docker (alternative)

```bash
docker compose up --build -d
docker compose run --rm api npm run migrate
docker compose run --rm api npm run seed
```

Note: the compose file maps MySQL to host port **3307** (not 3306) to avoid
clashing with a local MySQL/MariaDB install (e.g. XAMPP) — the `api`
container still reaches it on the default 3306 internally via the `mysql`
service name.

### Seeded dev login

```
email:    admin@pnc-pss.local
password: ChangeMe123!
```

Change this before anything resembling production use — it's a dev-only seed.

## Connecting the frontend

In the frontend's `.env.development` (or `.env.production`), set:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

That's the entire integration step — verified end-to-end (see below), no
frontend code changes needed.

## API surface

| Method | Path | Auth |
|---|---|---|
| `GET` | `/health` | none |
| `POST` | `/api/visitors/check-in` | none (rate-limited) |
| `GET` | `/api/visitors` | Bearer |
| `GET` | `/api/visitors/:id` | Bearer |
| `POST` | `/api/auth/login` | none (rate-limited) |
| `POST` | `/api/auth/logout` | Bearer |
| `GET` | `/api/auth/me` | Bearer |

Request/response shapes are documented in
[../docs/BACKEND_API_TODO.md](../docs/BACKEND_API_TODO.md) — they mirror
the frontend's `checkin.mock.js` exactly.

## Project layout

```text
src/
├── config/       # env.js, db.js (Knex instance)
├── routes/        # thin route → controller wiring
├── controllers/    # parse req, call service, shape response
├── services/        # business logic (badge codes, DTO mapping)
├── repositories/     # Knex queries only, no business logic
├── middleware/         # auth (JWT), rate limiting, validation, error handler
├── validators/          # zod schemas — kept in sync with frontend constants
├── constants/            # enum values mirrored from the frontend
├── utils/                  # logger, badge code generator, ApiError
└── db/
    ├── migrations/
    └── seeds/
```

## Data model notes

- `visitors` — one row per check-in submission.
- `visitor_term_acceptances` — one row **per checkbox** (6 per visitor), not
  a JSON blob, since this form captures safeguarding/media-consent
  acknowledgments — an auditable per-clause trail was worth the extra table.
- `users` — auth only; no admin UI consumes this yet (see frontend README's
  Assumptions — the frontend has no login screen, this is prep).

## Validation

Every rule the frontend checks client-side is re-checked here — a client
that skips the UI cannot skip validation, and in particular **cannot submit
without all six terms accepted**. See `src/validators/checkin.validator.js`.

## Testing

```bash
npm test
```

Uses a separate `pnc_visitor_app_test` database (create + migrate it once):

```bash
mysql -u root -e "CREATE DATABASE pnc_visitor_app_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
NODE_ENV=test npx knex migrate:latest
```

15 tests cover: valid check-in → exact response shape, every validation
rejection path (missing field, bad enum, missing/false term), term
acceptances persisted correctly, auth login/me/protected-route behavior.

## Verified

- [x] `npm run migrate` + `npm run seed` run clean against a fresh database.
- [x] `npm test` — 15/15 passing.
- [x] Manually smoke-tested every endpoint with curl (valid + invalid
      payloads, auth, rate-limit-eligible routes).
- [x] Ran the frontend's full 5-step wizard end-to-end (Playwright) against
      this real server with `VITE_USE_MOCK_API=false` — zero frontend code
      changes needed, response persisted correctly to MySQL.
- [x] `docker compose up --build`, migrate, seed, and a check-in smoke test
      all verified working in this environment (then torn down — see below).

## Not yet done / deliberately deferred

- Data retention / PII access-control policy — flagged, not decided, in
  `../docs/BACKEND_API_TODO.md` §5. This form collects visitor PII and
  safeguarding acknowledgments; confirm policy before production use.
- No refresh-token flow; `/auth/logout` is a stateless no-op today (see
  comment in `auth.controller.js`) since nothing consumes login yet.
- No admin UI for `GET /visitors` yet — the endpoint exists and is tested,
  but nothing in the frontend calls it (out of scope per the frontend
  README's Assumptions).
