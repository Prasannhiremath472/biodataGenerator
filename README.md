# Biodata Generator

A production-ready full-stack application for creating professional biodata / marriage biodata / resume documents using multiple templates, with multilingual support (11 Indian languages + English), PDF/DOCX export, image upload, and mobile responsiveness.

## Monorepo Structure

```
biodataGenerator/
├── frontend/            # React + Vite + TypeScript SPA
├── backend/             # Node.js + Express + TypeScript API
├── database/            # MySQL schema, migrations, seed data
├── docs/                # Architecture notes, API docs, deployment guide
└── README.md
```

## Tech Stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS, React Hook Form, Zod, React Query, i18next, React Router, Framer Motion

**Backend:** Node.js, Express, TypeScript, MySQL, JWT, Multer, Puppeteer (PDF), `docx` (Word export)

**Deployment:** Frontend on Vercel, Backend as Vercel Serverless Functions, MySQL on a managed provider (PlanetScale / Railway / RDS). No containerization — deployment targets Vercel's native Node runtime directly.

## Getting Started

See [docs/SETUP.md](docs/SETUP.md) for local development setup and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deploying to Vercel.

## Build Phases

This project is being built incrementally:

1. **Phase 1 (current):** Architecture, MySQL schema, folder structure, env templates
2. **Phase 2:** Backend core — auth, biodata CRUD, middleware, validation
3. **Phase 3:** Template engine + first 3-5 templates
4. **Phase 4:** PDF/DOCX export pipeline
5. **Phase 5:** Frontend — auth, dashboard, biodata form, template gallery
6. **Phase 6:** Multilingual system (i18next, RTL, Unicode export)
7. **Phase 7:** Admin panel
8. **Phase 8:** Remaining templates, tests, polish, deployment

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design details.