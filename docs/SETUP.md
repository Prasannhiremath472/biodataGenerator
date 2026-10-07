# Local Setup

No containers are used in this project — everything runs as plain Node processes against a MySQL server you control (local install or a managed cloud instance).

## Prerequisites

- Node.js 20+
- A MySQL 8 server (local install, or a free tier on PlanetScale/Railway/Aiven)

## 1. Database

```bash
# create the database (adjust credentials as needed)
mysql -u root -p -e "CREATE DATABASE biodata_generator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

cd backend
cp .env.example .env
# edit .env with your DB credentials

cd ..
node database/run.js reset   # applies schema.sql + all seeds
```

Use `node database/run.js migrate` / `node database/run.js seed` if you prefer running the numbered migration files individually instead of the consolidated `schema.sql`.

## 2. Backend

```bash
cd backend
npm install
npm run dev      # starts on http://localhost:4000
```

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev       # starts on http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:4000`, so the frontend and backend can run side by side without CORS issues in dev.

## Running Tests

```bash
cd backend && npm test                 # unit tests
cd backend && npm run test:integration # integration tests (needs a test DB)
cd frontend && npm test                # frontend unit tests
cd frontend && npm run test:e2e        # Playwright e2e tests
```
