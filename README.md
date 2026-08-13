# Nextjobz CRM — Backend API

REST backend for the Nextjobz CRM frontend. It pulls **live data from Metabase**
(your SQL Server `NextJobzReporting` database) for the entities that map cleanly,
and serves seeded data for the CRM entities that have no live source yet.

## Endpoints

Same shape the frontend's `js/api.js` expects:

```
GET  /api/health
GET  /api/dashboard            → live KPIs (users, employers, jobs, applications…)
GET  /api/<entity>             → list
GET  /api/<entity>/:id         → single record
POST /api/<entity>             → create (seed entities only)
PUT  /api/<entity>/:id         → update (seed entities only)
DELETE /api/<entity>/:id       → remove (seed entities only)
```

**Live from Metabase:** `employers`, `leads`, `contacts`, `orders` (job posts),
`queries` (ContactUs), `jobseekerSupports` (job-seeker profiles).

**Seeded (no live mapping yet):** `deals`, `visits`, `collections`, `campaigns`,
`requirements`, `proposals`, `payrollClients`, `vendors`, `events`, `targets`,
`dailyReports`.

Live entities are **read-only** — writes are acknowledged but not persisted to the
source system (the CRM is a coordination layer, not the system of record).

## Environment variables

| Variable | Purpose |
|---|---|
| `METABASE_URL` | Metabase base URL (defaults to `https://metabase.nextjobz.com.bd`) |
| `METABASE_API_KEY` | Metabase API key (**required**, secret) |
| `METABASE_DATABASE_ID` | Metabase database id (default `2` = `NextJobzReporting`) |

## Run locally

```bash
export METABASE_API_KEY='your-metabase-api-key'
node server.js          # http://localhost:3000
```

## Deploy

Vercel (serverless catch-all at `api/[...path].js`) — set the env vars above and
`vercel --prod`.
