# Architecture

## Overview

The system is a monorepo with three independently deployable units:

- **frontend/** — React SPA, builds to static assets, deployed to Vercel.
- **backend/** — Express API, deployed as Vercel Serverless Functions (each route group compiled as a function; see `docs/DEPLOYMENT.md`).
- **database/** — MySQL schema + migrations + seeds, run against a managed MySQL instance (PlanetScale, Railway, AWS RDS, etc.). No containers are used anywhere in this stack — local dev runs Node directly against a local or remote MySQL instance.

## Request Flow

```
Browser (React SPA)
   │  fetch via React Query
   ▼
Vercel Edge / CDN (static assets)
   │
   ▼
Vercel Serverless Functions (Express app, one entry per route group)
   │  JWT verified in middleware
   ▼
Service layer (business logic)
   │
   ├── MySQL (mysql2 pool) — users, biodatas, templates, etc.
   ├── Storage (local disk in dev / S3-compatible bucket in prod) — uploaded images
   └── Export workers — Puppeteer (PDF), docx (Word)
```

## Backend Layering

```
routes/        → defines HTTP endpoints, wires validators + controllers
controllers/   → parses req/res, calls services, shapes HTTP response
services/      → business logic, no req/res knowledge (testable in isolation)
  ├── pdf/      → Puppeteer-based HTML→PDF rendering, Unicode fonts, QR, watermark
  ├── docx/     → docx library document builders
  └── storage/  → image upload abstraction (local FS dev, S3 prod)
models/        → typed DB access (mysql2 query builders, no ORM — explicit SQL)
middleware/    → auth (JWT), rate limiting, error handling, validation, helmet/CORS
validators/    → Zod schemas shared in spirit with frontend validators
templates/     → template JSON configs + rendering engine
utils/         → token signing, password hashing, QR generation, logging
types/         → shared TypeScript types/interfaces
```

No ORM is used — `mysql2` with parameterized queries gives full control over the schema (soft deletes, audit columns, complex joins for biodata sections) without ORM migration friction. SQL injection protection comes from strict parameterization, enforced via a thin query-builder utility, never string concatenation.

## Template Engine

Templates are defined as JSON configs (`backend/src/templates/configs/*.json`) describing:

- `sections[]` — ordered list of biodata sections to render (personal info, education, family, etc.), each independently toggleable/reorderable
- `theme` — color palette (primary/secondary/accent/background/text), font family per language script, spacing scale
- `layout` — single-column / two-column / photo-centric / sidebar variants

A single React renderer component (`frontend/src/components/templates/TemplateRenderer.tsx`) and a matching server-side HTML renderer (used by the PDF service) both consume the same JSON config, so preview-in-browser and exported-PDF stay visually identical. User customizations (color/font overrides, section order) are stored per-biodata in `template_customizations` and merged over the base template config at render time.

## Multilingual System

- All UI strings live in `frontend/src/locales/<lang>/*.json`, loaded by i18next.
- Biodata *content* (the user's actual data) is stored as entered — language affects labels/UI and, for export, the font/script used to render that content.
- Urdu uses an RTL layout variant in both the React renderer and the server HTML renderer (`dir="rtl"` + mirrored layout rules).
- PDF/DOCX export embeds Unicode-capable fonts per script (Noto Sans family covers all 11 target scripts) so exported documents render correctly regardless of the OS the recipient opens them on.

## Export Pipeline

- **PDF:** Puppeteer renders the same HTML template engine output used for in-browser preview, prints to A4 PDF, then a post-process step can overlay a QR code (link back to the public biodata page) and an optional watermark.
- **DOCX:** Built independently with the `docx` library from the biodata data model directly (not from HTML), mapping each template's section order/theme into native Word paragraphs/tables so the file is genuinely editable, not an HTML-to-Word dump.

## Auth

Access token (short-lived JWT, 15 min) + refresh token (long-lived, stored hashed in DB, rotated on use) pattern. Refresh tokens are revocable (supports logout-everywhere and admin force-logout).

## Database Design Principles

- Every user-facing table has `created_at`, `updated_at`, `deleted_at` (soft delete) and, where relevant, `created_by`/`updated_by` audit columns.
- Foreign keys enforce referential integrity (`ON DELETE CASCADE` for owned child data like biodata sections/images, `ON DELETE SET NULL` for optional references like template).
- Indexes on all foreign keys and frequently filtered columns (`email`, `slug`, `status`).
- See `database/schema.sql` for the full DDL and `docs/DATABASE.md` for an entity-relationship narrative.
