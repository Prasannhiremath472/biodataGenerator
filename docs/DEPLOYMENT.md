# Deployment Guide (Vercel — no containers)

This project deploys without Docker: the frontend builds to static assets served by Vercel's CDN, and the backend runs as Vercel Serverless Functions (plain Node, not a container).

## 1. Database

Provision a managed MySQL instance reachable from the public internet (PlanetScale, Railway, AWS RDS, etc.) — Vercel functions are stateless and cannot host MySQL themselves.

```bash
node database/run.js reset   # run once against the production DB to create schema + seed data
```

Set the resulting connection details as environment variables in the backend Vercel project (see below).

## 2. Backend (Vercel Serverless Functions)

The Express app is adapted to Vercel's Node serverless runtime via a single catch-all function entry that wraps the Express app (`backend/api/index.ts` exporting the Express `app`, with `vercel.json` routing all requests to it).

`backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }]
}
```

Steps:
1. `vercel link` inside `backend/`.
2. In the Vercel project dashboard, add all variables from `.env.example` (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT secrets, SMTP, S3/storage config, etc.) under Settings → Environment Variables.
3. Puppeteer on serverless requires `@sparticuz/chromium` (a slimmed Chromium build for Lambda-style runtimes) instead of full Puppeteer's bundled Chromium — swap the PDF service's launch args accordingly for production (`chromium-min` + `puppeteer-core`), since the default Puppeteer download is too large for the function bundle.
4. `vercel --prod` to deploy.

## 3. Frontend (Vercel Static/Edge)

1. `vercel link` inside `frontend/`.
2. Set `VITE_API_BASE_URL` to the deployed backend's URL (e.g. `https://biodata-api.vercel.app/api`).
3. Build command: `npm run build`, output directory: `dist`.
4. `vercel --prod`.

## 4. Image Storage in Production

Vercel functions have an ephemeral, read-only-except-/tmp filesystem — `STORAGE_DRIVER=local` only works in local dev. In production set `STORAGE_DRIVER=s3` and point at an S3-compatible bucket (AWS S3, Cloudflare R2, Backblaze B2) so uploaded profile/gallery images persist across function invocations.

## 5. Post-Deploy Checklist

- [ ] Rotate `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` to strong random values (never reuse `.env.example` placeholders)
- [ ] Change the seeded admin password immediately (`database/seeds/003_admin_user.sql` ships a known default — treat it as compromised on first login)
- [ ] Confirm CORS `CLIENT_URL` matches the deployed frontend origin
- [ ] Verify rate limiting and Helmet headers are active (`curl -I` the deployed API)
- [ ] Smoke test PDF/DOCX export in the deployed environment specifically — serverless Chromium behaves differently than local Puppeteer
