# Playwright Test-as-a-Service (TaaS) API

A robust, TypeScript-based REST API designed for programmatically recording, managing, executing, and analyzing Playwright browser tests. Built using **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Playwright**.

---

## 🚀 Key Features

* **JWT Authentication**: Secure user registration, login, and profile access.
* **Test Case CRUD**: Full test metadata and TypeScript code snippet lifecycle.
* **Isolated Run Execution**: Executes test cases dynamically in isolated environments, configuring browser engines and viewport emulations per execution.
* **Artifact Tracking**: Captures and persists logs, screenshots, videos, and trace zips from Playwright's native JSON reporter.
* **Local Test Recorder**: Spawns Playwright Codegen sessions on the server host and saves user browser actions automatically into test cases.
* **Cascading Cleanup**: Deletes database records and runs directories on disk recursively upon test case deletion.
* **Pre-configured Emulations**: Feeds frontend clients with supported device descriptors available in Playwright.

---

## 🛠️ Technology Stack

* **Runtime & Compiler**: Node.js, TypeScript (`ts-node`, `tsc`)
* **Framework**: Express, CORS
* **Database**: MongoDB (Mongoose)
* **Testing Engine**: Playwright (`@playwright/test`)
* **Security**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
* **Test Suite**: Jest, Supertest (`ts-jest`)

---

## 📂 Directory Layout

```
apis/
  ├─ src/
  │   ├─ app.ts                # Express application configuration
  │   ├─ index.ts              # Server bootloader & port listening
  │   ├─ config/
  │   │   └─ db.ts             # Mongoose database connection
  │   ├─ models/
  │   │   ├─ User.ts           # User schema (name, email, passwordHash)
  │   │   ├─ TestCase.ts       # TestCase schema (specCode, defaults)
  │   │   └─ TestRun.ts        # TestRun schema (status, stdout, traces)
  │   ├─ middleware/
  │   │   └─ auth.ts           # JWT AuthenticatedRequest middleware
  │   ├─ routes/
  │   │   ├─ auth.ts           # Registration & Login endpoints
  │   │   ├─ tests.ts          # Test cases management (CRUD)
  │   │   ├─ runs.ts           # Test execution and artifact retrieval
  │   │   ├─ record.ts         # Playwright codegen browser recorder
  │   │   └─ devices.ts        # Supported Playwright devices listing
  │   ├─ services/
  │   │   ├─ configGen.ts      # Programmatic Playwright config generation
  │   │   └─ runner.ts         # Child-process execution & JSON report parser
  │   └─ __tests__/
  │       └─ api.test.ts       # Mocked route integration test suite
  ├─ runs/                     # Execution artifacts (screenshots, video, traces)
  ├─ tmp/                      # Temporary spec and configuration files
  ├─ api_tests.http            # HTTP REST Client file (endpoints testing)
  ├─ jest.config.js            # Jest testing setup
  ├─ tsconfig.json             # TypeScript settings
  └─ package.json              # Package details & commands
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed and running on your local machine or a remote database URL.

### 2. Install Dependencies
Navigate into the `apis` folder and install NPM packages:
```bash
npm install
```

### 3. Install Playwright Browsers
Install browser binaries and their system dependencies:
```bash
npm run playwright-install
```

### 4. Environment Variables
Create a `.env` file in the `apis` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/playwright-taas
JWT_SECRET=your_jwt_secret_key_here
```

---

## 💻 Available Scripts

* **`npm run dev`**: Starts the application using `ts-node` in development mode.
* **`npm run build`**: Compiles TypeScript files (`.ts`) to JavaScript (`.js`) under the `dist/` directory.
* **`npm run start`**: Launches the compiled JavaScript production server.
* **`npm run test`**: Runs the Jest integration test suite.
* **`npm run playwright-install`**: Downloads Playwright's Chromium browser and FFmpeg decoder.

---

## 📡 API Documentation

All routes (except `/api/auth/register` and `/api/auth/login`) require the `Authorization: Bearer <token>` header.

### 1. Authentication (`/api/auth`)
* `POST /register` — Register a user. Body: `{ name, email, password }`
* `POST /login` — Login user. Body: `{ email, password }`
* `GET /me` — Retrieve active profile.

### 2. Test Cases (`/api/tests`)
* `POST /` — Create a test case. Body: `{ name, description?, specCode, targetUrl?, defaultEmulation?, source? }`
* `GET /` — List user's test cases.
* `GET /:id` — Get test case details.
* `PUT /:id` — Update test details or spec code.
* `DELETE /:id` — Deletes test case, its database runs, and disk output folders.

### 3. Executions & Results (`/api`)
* `POST /tests/:id/run` — Executes a test case. Body (optional overrides): `{ browser, device }`
* `GET /tests/:id/runs` — Fetch execution runs history list.
* `GET /runs/:runId` — Fetch execution detail and parsed logs.
* `GET /runs/:runId/artifacts/:fileName` — Serve screenshots/videos directly.
* `GET /runs/:runId/artifacts-wildcard/*` — Serve deep-nested reports/attachments recursively.

### 4. Interactive Tools (`/api`)
* `GET /devices` — List Playwright devices list.
* `POST /record` — Spawn browser recorder. Body: `{ url, name }`. Blocks until browser is closed, then saves recorded spec code to database.

---

## 🧪 Testing and Verification

To verify all API endpoints are working:
1. Run the automated integration test suite:
   ```bash
   npm test
   ```
2. For manual payloads and manual endpoint invocation, use the included HTTP client file:
   [api_tests.http](./api_tests.http)
