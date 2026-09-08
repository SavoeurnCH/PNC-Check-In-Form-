# PNC & PSS Visitor Check-In

A bilingual (Khmer / English) visitor check-in kiosk built from the
[Figma design](https://www.figma.com/design/27Q18sjvCxih646uf05swk/PNC-Visitor-CheckIn).
Vue 3 (Composition API) + Vite + Tailwind CSS 4 + Vue Router + Pinia + Axios.

A matching backend now exists in [server/](server/) (Node.js/Express +
MySQL) — see [server/README.md](server/README.md) to run it, and
[docs/BACKEND_API_TODO.md](docs/BACKEND_API_TODO.md) for the contract it
was built against. Set `VITE_USE_MOCK_API=false` below to use it.

Deploying to a real server? See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
(nginx + systemd + MySQL, step by step).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

Copy `.env` and adjust as needed — see [Environment config](#environment-config) below.

## What's implemented

A single-flow, 5-step wizard (matching the Figma export exactly) plus a
confirmation screen:

1. **Personal Info** — full name, contact info, email (optional)
2. **Affiliation** — "coming from" (NGO / Company / Individual / School /
   Other) + organization name
3. **Visit Details** — accompanying visitors, their positions, person/department to meet
4. **Purpose of Visit** — card-select (Meeting, Campus Tour, Partnership
   Discussion, Training, Delivery, Maintenance/Support, Other)
5. **Terms & Policies** — a 6-card carousel (Registration & Access,
   Child/Youth Safeguarding, Media Consent, Health & Safety, Compliance &
   Property, Acknowledgment), each requiring its checkbox before advancing
6. **Success screen** — badge code + "New Check-In" to reset for the next visitor

### Pages (`src/pages/`)
- `CheckInPage.vue` — hosts the wizard, switches step components by `store.currentStep`
- `CheckInSuccessPage.vue` — confirmation screen (not in the Figma export — see Assumptions)
- `NotFoundPage.vue` — 404 fallback

### Feature components (`src/components/checkin/`)
- `WizardCard.vue`, `StepIndicator.vue`, `SectionHeading.vue`, `WizardNavButtons.vue`
- `StepPersonalInfo.vue`, `StepAffiliation.vue`, `StepVisitDetails.vue`, `StepPurpose.vue`, `StepTerms.vue`
- `TermsCarousel.vue`

### Reusable components (`src/components/common/`)
`BaseButton`, `BaseInput`, `BaseCheckbox`, `SelectableCard`, `LoadingSpinner`,
`AlertBanner` (error/retry), `BaseModal`, `HelpModal`

### Layout (`src/components/layout/` + `src/layouts/`)
`TopBar`, `AppFooter`, `DefaultLayout` (gradient shell used by every page)

### State (`src/stores/`)
- `checkin.store.js` — the wizard's single source of truth: form fields,
  step/term-card navigation, per-step validation, submit lifecycle
  (loading/error/success), reset
- `auth.store.js` — minimal scaffold only (see Assumptions — no login UI exists yet)

### API layer (`src/services/`)
- `api/axios.js` + `api/interceptors.js` — shared Axios instance, auth header
  injection, 401 handling, normalized error messages
- `modules/checkin.api.js`, `modules/auth.api.js` — one function per endpoint;
  components never call Axios directly
- `mock/checkin.mock.js` — simulated submit (latency + occasional random
  failure in dev, so the error/retry UI is exercised) used while
  `VITE_USE_MOCK_API=true`

### Routing (`src/router/index.js`)
`/` → `/checkin` → `/checkin/success` (guarded: redirects back if nothing was
submitted yet) → `/:pathMatch(.*)*` 404. No protected routes exist yet, but
the response interceptor already checks `router.hasRoute('login')` so wiring
one up later needs no changes to the interceptor.

## Environment config

| File | Purpose |
|---|---|
| `.env` | shared defaults |
| `.env.development` | local dev overrides |
| `.env.production` | production overrides |

| Variable | Meaning |
|---|---|
| `VITE_API_BASE_URL` | backend base URL |
| `VITE_USE_MOCK_API` | `true` uses `services/mock/`, `false` calls the real API via Axios |

Flip `VITE_USE_MOCK_API=false` and point `VITE_API_BASE_URL` at the real
backend once `POST /visitors/check-in` exists — no other code changes needed.

## Assumptions (Figma had no coverage)

- **Success/confirmation screen**: no exports covered what happens after the
  final "Submit". Built to match the rest of the flow's visual language
  (white card, org logos, brand-blue accents).
- **Scope**: the generic project brief mentioned login/dashboard/user-list
  pages, but the Figma file only contains the public kiosk flow above. Per
  the user's direction, only that flow was built; the auth store, API
  module, and router guard hook are scaffolded but no login/admin screens
  were invented.
- **Help modal content** (behind the "?" icon): not covered by the exports —
  a minimal, on-tone placeholder was written.
- **Khmer text**: transcribed visually from the exported PNGs (cropped and
  upscaled for legibility, no access to the live Figma text layers). Spelling
  and diacritics should be verified against the source file before
  production use — see `src/constants/checkin.constants.js`.
- **Selected-card style**: the exports never show a selectable card (Coming
  From / Purpose of Visit) in its active state, so a filled brand-blue
  background with white text was chosen as the simplest option consistent
  with the rest of the palette.

## Verification

- `npm run build` succeeds with no warnings (confirmed).
- Full wizard flow (all 5 steps + all 6 terms cards + submit) driven
  end-to-end with Playwright against the dev server — zero console errors.
- Checked at mobile (390px), tablet (768px), and desktop (1280px) widths.
