# Backend API Development TODO — Node.js + MySQL for PNC & PSS Visitor Check-In

Act as a **Senior Backend Engineer**. Build a REST API in **Node.js + MySQL**
that the existing Vue 3 frontend (`pnc visitor app`) can be pointed at by
flipping one env var, with zero frontend code changes. The frontend already
defines the exact contract below — treat it as the spec, not a suggestion.

---

## 0. Ground truth — read before writing any code

The frontend is already built and calling a specific shape. Don't redesign
it; match it.

- **Base URL contract**: frontend calls `api.post('/visitors/check-in', payload)`
  etc. against an Axios instance whose `baseURL` is
  `import.meta.env.VITE_API_BASE_URL` (see
  [src/services/api/axios.js](../src/services/api/axios.js)). So if
  `VITE_API_BASE_URL=http://localhost:8000/api`, your server must expose
  `POST http://localhost:8000/api/visitors/check-in`.
- **Auth header contract**: the request interceptor
  ([src/services/api/interceptors.js](../src/services/api/interceptors.js))
  attaches `Authorization: Bearer <token>` from `localStorage` on every
  request when a token exists. On any `401` response it clears the token
  client-side.
- **Error shape contract**: the response interceptor reads
  `error.response.data.message` as the human-readable error string. Every
  non-2xx response **must** include a top-level `message` field.
- **Mock reference implementation**: [src/services/mock/checkin.mock.js](../src/services/mock/checkin.mock.js)
  is the exact shape the real endpoint must reproduce — use it as a spec, not
  just a dev fallback.
- **Toggle to go live**: frontend has `VITE_USE_MOCK_API` (see `.env`,
  `.env.development`, `.env.production`). Once this API exists, set it to
  `false` and point `VITE_API_BASE_URL` at this server — that's the entire
  frontend-side integration step. If more changes than that are needed, the
  contract wasn't matched.

### Request payload — `POST /visitors/check-in`

Exact shape built by `buildPayload()` in
[src/stores/checkin.store.js](../src/stores/checkin.store.js):

```jsonc
{
  "fullName": "string, required",
  "contactInfo": "string, required (loose phone format)",
  "email": "string, optional, omitted if blank",
  "comingFrom": "one of: ngo | company | individual | school_university | other",
  "organizationName": "string, optional",
  "accompanyingVisitors": "number | null",
  "accompanyingPositions": "string, optional",
  "personToMeet": "string, required",
  "purpose": "one of: meeting | campus_tour | partnership_discussion | training_workshop | delivery | maintenance_support | other",
  "acceptedTerms": {
    "registration_access": true,
    "child_youth_safeguarding": true,
    "media_consent": true,
    "health_safety_environment": true,
    "compliance_property": true,
    "acknowledgment_signature": true
  }
}
```

The `comingFrom`, `purpose`, and `acceptedTerms` key sets come from
[src/constants/checkin.constants.js](../src/constants/checkin.constants.js)
(`COMING_FROM_OPTIONS`, `PURPOSE_OPTIONS`, `TERMS_CARDS`). **Keep the enum
values and the six `acceptedTerms` keys byte-for-byte in sync with that
file** — if the frontend adds/renames an option, the backend enum must
follow, and vice versa.

### Response shape — `201 Created`

```jsonc
{
  "visitorId": "string",
  "fullName": "string",
  "checkedInAt": "ISO 8601 timestamp",
  "badgeCode": "string, short human-readable code (mock uses 6 char A-Z0-9)"
}
```

### Also referenced by the frontend (scaffolded, no UI yet)

`src/services/modules/auth.api.js` and `src/stores/auth.store.js` already
call these — build them too so auth isn't a second integration pass later:

- `POST /auth/login` — body `{ email, password }` (or your chosen
  credential shape) → `{ "token": "...", "user": { ... } }`
- `POST /auth/logout` — invalidates/no-ops server-side
- `GET /auth/me` — returns the current user from the Bearer token

No login page exists in the frontend yet — this is prep, not a feature to
front-run. Confirm the credential shape with whoever owns login UI before
building it out further.

---

## 1. Tech stack & project setup

- [ ] Node.js LTS + **Express** (matches the "Node.js" ask, minimal ceremony).
- [ ] **MySQL 8**, accessed via **`mysql2`** + **Knex** for query building and
      migrations (lightweight, SQL-first — avoids a Prisma codegen step for
      a project this size). If the team already has an ORM preference
      (Prisma, Sequelize, TypeORM), use that instead — don't introduce a
      second one.
- [ ] Decide where this lives: a `server/` (or `backend/`) folder alongside
      the existing Vue app in this repo, vs. a separate repo. For a project
      this size, a sibling folder in the same repo is simplest — confirm
      with the user if unsure.
- [ ] `npm init`, install `express mysql2 knex dotenv cors helmet
      express-rate-limit bcrypt jsonwebtoken zod pino pino-http`
      (swap `zod` for `express-validator`/`joi` if preferred; swap `pino`
      for `morgan` if preferred — pick one validator and one logger, don't
      install both).

### Folder structure

```text
server/
├── src/
│   ├── config/         # env.js, db.js (knex instance), cors.js
│   ├── routes/          # visitors.routes.js, auth.routes.js, health.routes.js
│   ├── controllers/     # thin — parse req, call service, shape response
│   ├── services/        # business logic (checkin.service.js, auth.service.js)
│   ├── repositories/    # DB queries only, no business logic
│   ├── middleware/       # auth.js, errorHandler.js, validate.js, rateLimit.js
│   ├── validators/       # zod schemas mirroring src/constants/checkin.constants.js
│   ├── constants/        # enum values kept in sync with the frontend's constants file
│   ├── utils/             # badgeCode.js, logger.js
│   ├── db/
│   │   ├── migrations/
│   │   └── seeds/
│   ├── app.js            # express app, middleware wiring
│   └── server.js         # http listen
├── .env.example
├── knexfile.js
├── package.json
└── README.md
```

---

## 2. Database schema (MySQL)

- [ ] `visitors` table:
  - `id` CHAR(36) PK (UUID) or BIGINT AUTO_INCREMENT + separate public id
  - `full_name` VARCHAR(255) NOT NULL
  - `contact_info` VARCHAR(50) NOT NULL
  - `email` VARCHAR(255) NULL
  - `coming_from` ENUM('ngo','company','individual','school_university','other') NOT NULL
  - `organization_name` VARCHAR(255) NULL
  - `accompanying_visitors` SMALLINT UNSIGNED NULL
  - `accompanying_positions` VARCHAR(255) NULL
  - `person_to_meet` VARCHAR(255) NOT NULL
  - `purpose` ENUM('meeting','campus_tour','partnership_discussion','training_workshop','delivery','maintenance_support','other') NOT NULL
  - `badge_code` VARCHAR(12) NOT NULL UNIQUE
  - `checked_in_at` DATETIME NOT NULL
  - `created_at`, `updated_at` TIMESTAMP
- [ ] `visitor_term_acceptances` table (normalized, **not** a JSON blob — this
      is a compliance/safeguarding acknowledgment, keep an auditable
      per-clause record):
  - `id`, `visitor_id` FK → `visitors.id`
  - `term_key` ENUM('registration_access','child_youth_safeguarding','media_consent','health_safety_environment','compliance_property','acknowledgment_signature') NOT NULL
  - `accepted_at` DATETIME NOT NULL
  - unique constraint on `(visitor_id, term_key)`
- [ ] `users` table (for the scaffolded auth endpoints):
  - `id`, `email` UNIQUE, `password_hash`, `role`, `created_at`
- [ ] Write these as **Knex migrations**, not hand-run SQL — `npx knex
      migrate:latest` must build the schema from empty on any machine.
- [ ] Seed script: one working admin user for local login testing.

---

## 3. Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| `POST` | `/visitors/check-in` | none (public kiosk) | see payload/response above |
| `GET` | `/visitors` | Bearer | paginated, filter by date/purpose/comingFrom — not called by the frontend yet, but a natural next admin feature |
| `GET` | `/visitors/:id` | Bearer | includes `visitor_term_acceptances` |
| `POST` | `/auth/login` | none | rate-limit this one too |
| `POST` | `/auth/logout` | Bearer | |
| `GET` | `/auth/me` | Bearer | |
| `GET` | `/health` | none | liveness check for deploy/monitoring |

Mount everything under `/api` if `VITE_API_BASE_URL` includes `/api` (it
does in `.env` — `http://localhost:8000/api`).

---

## 4. Validation — never trust the client

The frontend already validates client-side
([src/utils/validators.js](../src/utils/validators.js)) — the backend must
re-enforce every one of these rules independently, because a malicious or
buggy client can call the API directly and skip the UI entirely:

- [ ] `fullName`, `contactInfo`, `personToMeet` required, non-empty after trim.
- [ ] `contactInfo` matches a phone-like pattern.
- [ ] `email`, if present, is a valid email format.
- [ ] `comingFrom` is one of the 5 enum values — reject anything else with `400`.
- [ ] `purpose` is one of the 7 enum values — reject anything else with `400`.
- [ ] `acceptedTerms` contains **all six** keys set to `true`. This is the
      one that matters most: it's a legal/safeguarding acknowledgment
      (child protection, media consent, etc.) — **reject the submission
      with `400` if any of the six terms is missing or `false`, regardless
      of what the client claims.**

---

## 5. Auth & security

- [ ] Passwords hashed with `bcrypt` (never store plaintext).
- [ ] JWT for `/auth/login`; verify + attach `req.user` via middleware on
      protected routes.
- [ ] `express-rate-limit` on `POST /visitors/check-in` and `POST
      /auth/login` — both are public-facing and abusable.
- [ ] `cors` configured to the frontend's actual origin(s) (dev:
      `http://localhost:5173`; add the production origin once known) — not
      a wildcard, since auth tokens are involved.
- [ ] `helmet` for standard security headers.
- [ ] All queries parameterized via Knex — no raw string concatenation.
- [ ] **Flag for the user, don't decide silently**: this form collects
      minor-adjacent safeguarding data and visitor PII. Confirm data
      retention policy, who can access `/visitors` list data, and whether
      this needs encryption at rest / a privacy policy before shipping to
      production — that's a product decision, not something to assume.

---

## 6. Error handling

- [ ] Central error-handling middleware; every error response is
      `{ "message": "...", ...optional field-level "errors": {} }` with an
      appropriate status code (`400` validation, `401` unauthorized, `404`
      not found, `409` conflict — e.g. badge code collision, `500` unhandled).
- [ ] Never leak stack traces or raw DB errors to the client.

---

## 7. Environment config

- [ ] `.env.example` committed (never the real `.env`):
  ```env
  PORT=8000
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=
  DB_PASSWORD=
  DB_NAME=pnc_visitor_app
  JWT_SECRET=
  JWT_EXPIRES_IN=8h
  CORS_ORIGIN=http://localhost:5173
  ```
- [ ] Once deployed, update the frontend's `.env.production`:
      `VITE_API_BASE_URL=<real URL>` and `VITE_USE_MOCK_API=false`.

---

## 8. Testing

- [ ] Unit tests (Jest or Vitest) for validators and services.
- [ ] Integration tests (Supertest) against a test DB, covering at minimum:
  - happy-path check-in → `201` with the exact response shape
  - missing required field → `400` with a `message`
  - invalid `comingFrom` / `purpose` enum value → `400`
  - `acceptedTerms` missing any of the six keys → `400`
  - login happy path → token issued; `GET /auth/me` with that token succeeds
  - protected route without/expired token → `401`

---

## 9. Deployment readiness

- [ ] `Dockerfile` + `docker-compose.yml` (app + MySQL) for local parity.
- [ ] Migrations run as a deploy step, not manually.
- [ ] Structured logging (`pino`/`morgan`) for requests and errors.
- [ ] `README.md` in the backend folder: setup, env vars, migration/seed
      commands, how to run tests, how this connects to the frontend's
      `VITE_API_BASE_URL` / `VITE_USE_MOCK_API`.

---

## 10. Final verification

- [ ] Fresh clone → `npm install` → migrate → seed → `npm run dev` works
      with no manual DB setup beyond env vars.
- [ ] `curl`/Postman smoke test of `POST /visitors/check-in` with a full
      valid payload returns the exact `CheckInResponse` shape.
- [ ] Submitting with `acceptedTerms` missing a key is rejected — confirm
      this can't be bypassed.
- [ ] Point the frontend at this server (`VITE_USE_MOCK_API=false`,
      `VITE_API_BASE_URL` set) and run the existing check-in flow — it
      should work with **zero frontend code changes**. If it doesn't, the
      contract was broken somewhere — fix the backend, not the frontend.
- [ ] `npm test` passes.
- [ ] No secrets committed; `.env` gitignored, `.env.example` present.
