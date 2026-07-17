# Test-as-a-Service (MERN + Playwright) — API Plan

## Context

You want to build a MERN application that offers "Test as a Service": users author
Playwright browser tests, execute them on demand, record new tests via
`npx playwright codegen`, replay/emulate them across devices and browsers, and
review saved results (including screenshots, video, and traces).

This plan focuses on the **backend API** (the core of the request) and lays out the
data models, endpoints, and execution mechanics, plus a thin React frontend and
JWT auth so the MVP is usable end-to-end.

### Decisions locked in (from clarifying questions)
- **Spec format:** raw Playwright **TypeScript** `.spec.ts` code (as produced by codegen).
- **Storage:** spec code lives as a **string in MongoDB**; a temp `.spec.ts` file is
  written only at execution time, then cleaned up.
- **Execution:** **synchronous** — API spawns `npx playwright test` as a child process,
  parses the JSON reporter output, saves + returns the result.
- **Recording:** **server-side** `npx playwright codegen` (assumes server runs on the
  user's local machine where a browser can open).
- **Emulation:** per-run profile (device + browser) injected via a **generated Playwright
  config** using Playwright's `devices[...]` registry.
- **Artifacts:** screenshots / video / trace saved to a server folder and served via a
  download endpoint; shown in the React results view.
- **Scope:** Auth & users, React frontend, result history/reports, emulation config.

---

## Architecture Overview

```
client/ (React + Vite)          server/ (Node + Express)          Playwright
  ├─ Test list / editor  ──────▶  REST API  ──────▶  spawn `npx playwright test`
  ├─ Run + emulation UI          ├─ Mongoose models       (child_process)
  ├─ Recording trigger           ├─ JWT auth              generated config + temp spec
  └─ Results / artifacts         └─ artifact storage  ◀── JSON report + results/ dir
                                        │
                                   MongoDB (Atlas or local)
```

Suggested top-level layout:
```
/server
  ├─ src/
  │   ├─ index.ts              # express app bootstrap
  │   ├─ config/db.ts          # mongoose connection
  │   ├─ models/               # User, TestCase, TestRun
  │   ├─ middleware/auth.ts    # JWT verify
  │   ├─ routes/               # auth, tests, runs, record, devices
  │   ├─ controllers/
  │   ├─ services/
  │   │   ├─ runner.ts         # write temp spec + config, spawn, parse
  │   │   ├─ configGen.ts      # generate playwright.config for a run
  │   │   └─ codegen.ts        # spawn `playwright codegen`
  │   └─ utils/paths.ts
  ├─ runs/                     # per-run artifacts (git-ignored)
  ├─ tmp/                      # temp spec + config files (git-ignored)
  └─ package.json
/client                        # React + Vite app
```

---

## Data Models (Mongoose)

**User**
```
{ _id, name, email (unique), passwordHash, createdAt }
```

**TestCase**
```
{ _id, owner: ObjectId->User,
  name, description,
  specCode: string,             // full .spec.ts source
  targetUrl?: string,           // convenience metadata
  defaultEmulation?: { device?: string, browser: 'chromium'|'firefox'|'webkit' },
  source: 'manual' | 'codegen',
  createdAt, updatedAt }
```

**TestRun** (result history — one document per execution)
```
{ _id, testCase: ObjectId->TestCase, owner: ObjectId->User,
  status: 'passed'|'failed'|'timedout'|'error',
  emulation: { device?: string, browser: string },
  durationMs: number,
  startedAt, finishedAt,
  stdout: string, stderr: string,
  errorMessage?: string,
  report: Mixed,                // parsed slice of Playwright JSON report
  artifacts: [{ type:'screenshot'|'video'|'trace', path: string }] }
```

---

## API Endpoints

### Auth (`routes/auth.ts`)
- `POST /api/auth/register` → create user, hash password (bcrypt), return JWT
- `POST /api/auth/login` → verify, return JWT
- `GET  /api/auth/me` → current user (protected)

All routes below require the `auth` middleware and scope data to `req.user._id`.

### Test cases (`routes/tests.ts`)
- `POST   /api/tests` → create test case (body includes `specCode`)
- `GET    /api/tests` → list current user's tests
- `GET    /api/tests/:id` → fetch one (incl. specCode)
- `PUT    /api/tests/:id` → update name/description/specCode/emulation
- `DELETE /api/tests/:id` → delete test + its runs/artifacts

### Execution & results (`routes/runs.ts`)
- `POST /api/tests/:id/run` → **execute** (synchronous). Body: `{ device?, browser? }`
  overrides defaultEmulation. Returns the created `TestRun`.
- `GET  /api/tests/:id/runs` → run history for a test
- `GET  /api/runs/:runId` → single run detail
- `GET  /api/runs/:runId/artifacts/:file` → download/serve an artifact (static/stream)

### Recording (`routes/record.ts`)
- `POST /api/record` → body `{ url, name }`. Spawns `npx playwright codegen -o <tmp> <url>`.
  Blocks until the codegen window is closed, then reads the generated `.spec.ts`,
  creates a `TestCase` with `source: 'codegen'`, returns it.
  (Local-only feature; documented as such.)

### Emulation helpers (`routes/devices.ts`)
- `GET /api/devices` → list of supported device names from Playwright's `devices`
  registry, plus the three browser engines. Feeds the React emulation dropdown.

---

## Execution Mechanics (`services/runner.ts`) — the heart of the system

For `POST /api/tests/:id/run`:

1. Load `TestCase.specCode` from Mongo.
2. Create a unique run dir: `runs/<runId>/` and a temp spec `tmp/<runId>.spec.ts`,
   write `specCode` to it.
3. **Generate a Playwright config** for this run (`services/configGen.ts`):
   ```ts
   import { defineConfig, devices } from '@playwright/test';
   export default defineConfig({
     testDir: 'tmp',
     outputDir: 'runs/<runId>',
     reporter: [['json', { outputFile: 'runs/<runId>/report.json' }]],
     use: {
       ...(device ? devices['<device>'] : {}),
       browserName: '<browser>',
       screenshot: 'only-on-failure',
       video: 'retain-on-failure',
       trace: 'on',
     },
   });
   ```
4. Spawn: `npx playwright test tmp/<runId>.spec.ts --config <generated config>`
   via `child_process.spawn`, capturing stdout/stderr; enforce a timeout.
5. On exit, parse `runs/<runId>/report.json` → derive status, duration, error message.
6. Scan `runs/<runId>/` for screenshots/video/trace, record their paths in `artifacts`.
7. Persist a `TestRun`, clean up the temp spec file, return the run.

**Reuse over new code:** rely on Playwright's built-in **JSON reporter** for parsing
(don't hand-parse stdout) and its **`devices` registry** for emulation (don't hardcode
viewports). Playwright's own TS transpilation runs the `.spec.ts` directly — no separate
build step needed.

---

## React Frontend (`/client`, Vite)

Minimal but complete pages:
- **Auth**: login / register (store JWT in localStorage; axios interceptor).
- **Tests list**: table of test cases; create / delete.
- **Test editor**: name, description, and a code editor for `specCode`
  (use a lightweight editor like `@monaco-editor/react`). Emulation defaults picker
  (device + browser from `GET /api/devices`).
- **Run panel**: run button with emulation override → shows spinner → result.
- **Record**: form (url + name) → calls `POST /api/record`.
- **Results/history**: per-test run list with status badges, duration, error text,
  and links to screenshots / video / trace.

---

## Dependencies

**Server:** `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`,
`@playwright/test`, `typescript`/`ts-node` (+ `@types/*`). Run `npx playwright install`
once to download browsers.

**Client:** `react`, `react-router-dom`, `axios`, `@monaco-editor/react`, Vite.

---

## Build Order (implementation phases)

1. **Scaffold** server (Express + Mongoose + TS) and `.env` (Mongo URI, JWT secret).
2. **Auth**: User model, register/login/me, `auth` middleware.
3. **TestCase CRUD** + model, scoped to user.
4. **Runner service**: config generation, spawn, JSON-report parsing, artifact capture.
5. **Run endpoints** + TestRun model + artifact serving.
6. **Devices** endpoint (Playwright `devices`).
7. **Recording** endpoint (codegen spawn).
8. **React client**: auth → tests list → editor → run → results → record.
9. Polish: error handling, run timeout, artifact cleanup policy.

---

## Verification (end-to-end)

1. Start MongoDB, `npm run dev` in `/server`, run `npx playwright install`.
2. `POST /api/auth/register` → obtain JWT.
3. `POST /api/tests` with a known-good spec, e.g.:
   ```ts
   import { test, expect } from '@playwright/test';
   test('has title', async ({ page }) => {
     await page.goto('https://playwright.dev/');
     await expect(page).toHaveTitle(/Playwright/);
   });
   ```
4. `POST /api/tests/:id/run` with `{ browser: 'chromium' }` → expect `status: 'passed'`,
   a `durationMs`, and a `TestRun` saved. Then run one that intentionally fails and
   confirm `status: 'failed'` + a screenshot artifact appears under `runs/<runId>/`.
5. `POST /api/tests/:id/run` with `{ device: 'iPhone 13', browser: 'webkit' }` → confirm
   emulation applied (mobile viewport in the trace).
6. `GET /api/devices` returns the device list; `GET /api/tests/:id/runs` returns history.
7. `POST /api/record` with a URL → codegen window opens, record a few clicks, close it →
   confirm a new codegen-sourced TestCase is created with populated `specCode`.
8. In the React app: log in, create/run a test, view results + open an artifact.

---

## Notes & Risks
- **Server-side browsers**: `run` and `record` need Playwright browsers on the host and a
  display for `codegen`. Best run where a real browser can launch (developer's machine).
- **Concurrency**: synchronous runs block a request; fine for MVP/single user. A job queue
  (BullMQ/Redis) is the natural next step for multi-user scale.
- **Security**: `specCode` is arbitrary executable code. For a real multi-tenant service,
  sandbox execution (containers/VMs). Acceptable for a local/learning MVP — call this out.
- **Cleanup**: define retention for `runs/` artifacts to avoid unbounded disk growth.
