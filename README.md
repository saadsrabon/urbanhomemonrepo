# Urban Home & Security Platform

Custom rebuild of [urbanhomeandsecurity.com](https://urbanhomeandsecurity.com) with a modern Next.js frontend, Express API, PostgreSQL, and admin panel.

## Tech Stack

- **API:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Web:** Next.js 15 + Tailwind CSS + shadcn/ui
- **Auth:** JWT (access + refresh cookies) with RBAC
- **Deploy:** Docker Compose on VPS with Nginx

## Brand Colors

- Navy: `#0E2148`
- Gold: `#F2A81D`

## Quick Start (Development)

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL) or local PostgreSQL

### Setup

```bash
# Clone and install
npm install

# Copy environment (root `.env` for Docker; `server/.env` for local API — see `.env.example`)
cp .env.example .env
cp .env.example server/.env
# Local dev: set POSTGRES_PASSWORD=postgres and DATABASE_URL with localhost:5433 in server/.env

# Start PostgreSQL (host port 5433; production Dockploy uses docker-compose.yml only)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up postgres -d

# Run migrations and seed
npm run db:migrate
npm run db:seed

# Start dev servers (API + Web)
npm run dev
```

- API: http://localhost:4000
- Admin: http://localhost:3000/admin
- Health: http://localhost:4000/health

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@urbanhomeandsecurity.com | Admin@123456 |
| Manager | manager@urbanhomeandsecurity.com | Manager@123456 |
| Team Member | ryan@urbanhomeandsecurity.com | Team@123456 |

## Project Structure

```
├── server/          # Express API
│   ├── prisma/      # Schema, migrations, seed
│   └── src/         # Routes, controllers, middleware
├── web/             # Next.js app (admin + public)
├── nginx/           # Reverse proxy config
├── docker-compose.yml
└── docker-compose.dev.yml  # local Postgres port 5433
```

## API Overview

Public endpoints: `/api/services`, `/api/bookings`, `/api/contact`, `/api/team`, etc.

Admin endpoints: `/api/admin/*` (requires auth)

Team member: `/api/me/bookings`

## VPS Deployment (Dockploy)

Production deploy uses **Docker Compose** on a VPS with [Dockploy](https://dockploy.com/).

**Full step-by-step guide:** [DEPLOY-DOCKPLOY.md](DEPLOY-DOCKPLOY.md)

Quick summary:

1. Create a Dockploy **Compose** project from GitHub repo **`main`** branch.
2. Set environment variables from [`.env.example`](.env.example).
3. Point your domain to the **nginx** service (port 80) with HTTPS.
4. Deploy, then run `docker compose exec api npm run db:seed` once.

Also see [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md) for the optional Vercel demo deployment.

## Environment Variables

See [.env.example](.env.example) for all required variables.

## License

Private - Urban Home & Security
