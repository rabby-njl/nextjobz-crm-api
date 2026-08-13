# Nextjobz CRM — Backend API

REST backend for the Nextjobz CRM frontend. It pulls **live data from Metabase**
(your SQL Server `NextJobzReporting` database), and adds a simple employee
authentication layer. No demo/seed data is served — non-live entities start empty.

## Authentication

- **Login:** `POST /api/auth/login` with `{ "username": "<Enroll ID>", "password": "<Enroll ID>" }`.
  Username and password are both the employee's Enroll ID.
- **Session:** `GET /api/auth/me` (send `Authorization: Bearer <token>`).
- Every data route requires a valid Bearer token (401 otherwise).

Employees live in `lib/employees.js`; each maps to a CRM role that drives their
personalized dashboard (sales, marketing, CRM, events, recruiter, admin).

## Endpoints

```
POST /api/auth/login          → { token, employee }
GET  /api/auth/me             → current employee
GET  /api/health
GET  /api/dashboard           → live KPIs (users, employers, jobs, applications…)
GET  /api/<entity>            → list (auth required)
GET  /api/<entity>/:id        → single record
POST /api/<entity>            → create (non-live entities only, in-memory)
PUT  /api/<entity>/:id        → update (non-live entities only)
DELETE /api/<entity>/:id      → remove (non-live entities only)
```

**Live from Metabase:** `employers`, `leads`, `contacts`, `orders` (job posts),
`queries` (ContactUs), `jobseekerSupports` (job-seeker profiles), `collections`
(payment transactions), `events` (job-fair companies), `requirements`
(organic job requirements), `trainings` (LearningLab training courses +
corporate training requests).

**No live mapping yet (start empty):** `deals`, `visits`, `campaigns`,
`proposals`, `payrollClients`, `vendors`, `targets`, `dailyReports`.

Live entities are **read-only** — writes are acknowledged but not persisted to the
source system.

## Environment variables

| Variable | Purpose |
|---|---|
| `METABASE_URL` | Metabase base URL (defaults to `https://metabase.nextjobz.com.bd`) |
| `METABASE_API_KEY` | Metabase API key (**required**, secret) |
| `METABASE_DATABASE_ID` | Metabase database id (default `2`) |
| `AUTH_SECRET` | HMAC secret for session tokens (**required**, secret) |

## Future scope

- **iBOS ERP integration** via the MSSQL MCP server: automate sales invoices and
  procurement status sync (planned for a later phase).

## Run locally

```bash
export METABASE_API_KEY='...' AUTH_SECRET='...'
node server.js          # http://localhost:3000
```

## Deploy

Vercel (serverless catch-all at `api/[...path].js`) — set the env vars above and
`vercel --prod`.
