# UI Integration Plan — Omaha + MERN API

## Goal

Replace all hardcoded mock data in the React prototype with live data from the
MERN API defined in `API-PLAN.md`. Introduce real auth, an API client layer, and
React state/data-fetching patterns. The visual design and component tree stay the
same; only the data wiring changes.

---

## Project Structure

The existing prototype becomes `/client`. A new `/server` directory holds the
backend per `API-PLAN.md`. Final monorepo layout:

```
/
├─ client/               # existing React + Vite app (this repo)
│   ├─ src/
│   │   ├─ api/          # NEW — typed API client functions
│   │   ├─ context/      # NEW — AuthContext
│   │   ├─ hooks/        # NEW — useDashboard, useTestCases, useDetailView
│   │   ├─ components/   # existing components (data wiring changes only)
│   │   ├─ App.tsx
│   │   └─ main.tsx
│   └─ package.json
└─ server/               # NEW — per API-PLAN.md
```

---

## New Dependencies (client only)

```
axios                  # HTTP client with JWT interceptor
react-router-dom       # screen routing (replaces manual activeScreen state)
@monaco-editor/react   # specCode editor in TestCasesView create form
```

No charting library — existing raw SVG charts are kept.

---

## Phase 1 — API Client Layer (`src/api/`)

Create one file per API domain. All functions are async and return typed objects.
A shared `src/api/client.ts` configures an axios instance:
- `baseURL`: `import.meta.env.VITE_API_URL` (e.g. `http://localhost:4000/api`)
- Request interceptor: attaches `Authorization: Bearer <token>` from localStorage
- Response interceptor: on 401, clears token and redirects to login

```
src/api/
├─ client.ts           # axios instance + interceptors
├─ auth.ts             # register(), login(), getMe()
├─ tests.ts            # listTests(), getTest(), createTest(), updateTest(), deleteTest()
├─ runs.ts             # runTest(), listRuns(), getRun(), artifactUrl()
├─ devices.ts          # listDevices()
└─ index.ts            # re-exports
```

**Key types** (mirror the Mongoose models):

```ts
// src/api/types.ts
export interface TestCase {
  _id: string;
  name: string;
  description: string;
  specCode: string;
  targetUrl?: string;
  defaultEmulation?: { device?: string; browser: string };
  source: 'manual' | 'codegen';
  createdAt: string;
  updatedAt: string;
}

export interface TestRun {
  _id: string;
  testCase: string;
  status: 'passed' | 'failed' | 'timedout' | 'error';
  emulation: { device?: string; browser: string };
  durationMs: number;
  startedAt: string;
  finishedAt: string;
  stdout: string;
  stderr: string;
  errorMessage?: string;
  artifacts: { type: 'screenshot' | 'video' | 'trace'; path: string }[];
}

export interface DashboardStats {
  totalTests: number;
  automationCoverage: number;
  openDefects: number;
  activeSuites: number;
  passRate: number;
  executionsToday: number;
  avgRuntimeMs: number;
}
```

---

## Phase 2 — Auth (`src/context/AuthContext.tsx`)

Replace the hardcoded Login screen stub with real JWT auth.

```ts
interface AuthContext {
  user: { _id: string; name: string; email: string } | null;
  token: string | null;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): void;
}
```

- Token stored in `localStorage` under key `omaha_token`.
- `AuthContext` wraps the whole app in `main.tsx`.
- On mount, if a token exists, call `GET /api/auth/me` to rehydrate the user.
  If it returns 401, clear and redirect to login.
- `App.tsx` loses the `'login'` screen state entirely — `Login.tsx` becomes a
  route guarded by `AuthContext`.

---

## Phase 3 — Screen Routing (replace `activeScreen`)

Replace the manual `activeScreen` string in `App.tsx` with `react-router-dom`.

| Route | Component |
|---|---|
| `/login` | `Login.tsx` |
| `/` | Dashboard (HeroBanner + KPICards + Charts) |
| `/detail/:module` | `DetailView.tsx` |
| `/tests` | `TestCasesView.tsx` (list) |
| `/tests/new` | `TestCasesView.tsx` (create form) |
| `/tests/:id/run` | `TestCasesView.tsx` (execute form) |

The `TopBar` prototype screen-switcher tabs (1–4) can stay as nav links during
development, then be removed when not needed.

`Sidebar.tsx` link items become `<Link to="...">` elements.

`Header.tsx` derives its breadcrumb from `useLocation()` instead of the
`activeScreen` prop. The `CustomEvent('trigger-new-test-case')` hack is replaced
with a standard `<Link to="/tests/new">` on the "New test case" button.

---

## Phase 4 — Data Hooks (`src/hooks/`)

Each hook owns its loading/error state and exposes a `refresh()` function.

### `useDashboard(timeframe: string)`

Calls a `GET /api/dashboard?timeframe=7d` endpoint (add this to the server —
it aggregates `TestCase` and `TestRun` counts for the current user).

Returns: `{ stats: DashboardStats | null, chartData: ChartData | null, loading, error, refresh }`.

Feeds: `HeroBanner`, `KPICards`, all 5 chart components in `Charts.tsx`.

### `useTestCases()`

Calls `GET /api/tests`.

Returns: `{ tests: TestCase[], loading, error, createTest, updateTest, deleteTest }`.

Feeds: `TestCasesView` list view.

### `useTestRuns(testId: string)`

Calls `GET /api/tests/:id/runs`.

Returns: `{ runs: TestRun[], loading, error, executeRun }`.

`executeRun(emulation)` calls `POST /api/tests/:id/run`, shows a spinner (replaces
the current `setTimeout` simulation), then refreshes the run list on completion.

Feeds: `TestCasesView` execute view and run history.

### `useDetailView(module: string)`

Calls `GET /api/dashboard/module/:module` (add to server — aggregates runs and
defects per module).

Returns: `{ kpis, submodules, recentRuns, openDefects, loading, error, refresh }`.

Feeds: `DetailView.tsx`.

### `useDevices()`

Calls `GET /api/devices`. Cached — fetched once on mount.

Returns: `{ devices: string[], browsers: string[] }`.

Feeds: emulation pickers in `TestCasesView` create/execute forms.

---

## Phase 5 — Component Wiring

This phase replaces hardcoded data with hook/prop values. No visual changes.

### `App.tsx`

- Remove `activeScreen`, `isRefreshing`, `isRunning`, `toastMessage` state.
- Keep `timeframe` state (still a UI concern) and pass to `useDashboard`.
- `handleRefresh` calls `useDashboard().refresh()` — no `setTimeout`.
- `handleRunAll` becomes a route push to `/tests` with a run-all intent, or moves
  into `TestCasesView`.

### `HeroBanner.tsx`

Receives props from `useDashboard`:
```ts
interface HeroBannerProps {
  executionsToday: number;
  passRate: number;
  avgRuntimeMs: number;
  totalTests: number;
  activeModules: number;
  regressionCount: number;
  isLoading: boolean;
  onRunAll: () => void;
  isRunning: boolean;
}
```
Replace all hardcoded strings with formatted values from props.

### `KPICards.tsx`

Currently accepts no props. Give it:
```ts
interface KPICardsProps {
  totalTests: number;
  automationCoverage: number;
  openDefects: number;
  activeSuites: number;
  trends: { totalTests: string; automation: string; defects: string; suites: string };
  isLoading: boolean;
}
```
The four card objects become derived from props instead of inline constants.

### `Charts.tsx`

Each chart export gains a `data` prop typed to its specific shape; the hardcoded
`dailyData`, `cellLevels`, and module arrays are removed from the component body.
`useDashboard` fills these from the API response.

```ts
// example
export function ExecutionTrend({ data, isLoading }: {
  data: { date: string; passed: number; failed: number; noResult: number; error: number }[];
  isLoading: boolean;
}) { ... }
```

### `DetailView.tsx`

Receives all data via `useDetailView(module)`. The inline `const kpis`, `submodules`,
`recentRuns`, `openDefects` arrays are deleted. The fake `Math.sin` timeline heights
are replaced with real `durationMs` values scaled to the bar height.

### `TestCasesView.tsx`

List view: replaces hardcoded `testCases` initial state with `useTestCases().tests`.

Create form: on submit, calls `useTestCases().createTest(payload)` and navigates to
`/tests`. The `specCode` textarea is replaced with `<MonacoEditor language="typescript">`.

Execute form: on run, calls `useTestRuns(id).executeRun(emulation)`. Emulation
pickers are populated from `useDevices()`. The artifact links in run results use
`artifactUrl(runId, filename)` from `src/api/runs.ts`.

---

## Phase 6 — Server Addition (`GET /api/dashboard`)

The current API plan does not include a dashboard aggregation endpoint. Add two:

**`GET /api/dashboard?timeframe=7d`**

Aggregates from `TestCase` and `TestRun` collections for `req.user._id`:
- `totalTests`, `automationCoverage` (auto/total ratio)
- `passRate`, `executionsToday`, `avgRuntimeMs`
- `chartData.executionTrend` — one row per day in timeframe
- `chartData.executionResults` — grouped by status
- `chartData.bugsByModule` — grouped by module tag (requires `module` field on TestCase)
- `chartData.automationVsManual` — per module
- `chartData.activityHeatmap` — 126-day run count bucketed into levels 0–4

**`GET /api/dashboard/module/:module`**

Aggregates for a specific module:
- KPI summary (same shape as top-level but filtered)
- `submodules` — grouped by TestCase tags
- `recentRuns` — last 6 `TestRun` docs
- `openDefects` — placeholder until a `Defect` model is added (return empty array for MVP)

Add `module?: string` and `tags?: string[]` fields to the `TestCase` model to support
these aggregations.

---

## Loading & Error States

Each hook provides `loading: boolean` and `error: string | null`.

- While `loading`, replace hardcoded numbers with skeleton shimmer divs (Tailwind
  `animate-pulse bg-brand/10 rounded`). Do not show stale data.
- On `error`, show an inline error banner inside the affected card/section with a
  retry button that calls the hook's `refresh()`.
- The existing toast system in `App.tsx` is reused for success confirmations
  (test created, run started, run completed).

---

## Environment Configuration

```
# client/.env.local
VITE_API_URL=http://localhost:4000/api

# server/.env
PORT=4000
MONGO_URI=mongodb://localhost:27017/omaha
JWT_SECRET=<secret>
JWT_EXPIRES_IN=7d
```

---

## Implementation Order

1. Add `react-router-dom` and set up routes in `App.tsx` — no data changes yet.
2. Build `AuthContext` + wire `Login.tsx` to real `POST /api/auth/login`.
3. Create `src/api/` layer (all functions, typed, no UI yet).
4. Add `GET /api/dashboard` and `GET /api/dashboard/module/:module` to the server.
5. Build `useDashboard` hook and wire `HeroBanner`, `KPICards`, `Charts`.
6. Build `useTestCases` and wire `TestCasesView` list view.
7. Build `useTestRuns` + `useDevices` and wire create/execute forms.
8. Build `useDetailView` and wire `DetailView`.
9. Replace `window` custom event in `Header` → `<Link to="/tests/new">`.
10. Remove all hardcoded data arrays from component bodies.
