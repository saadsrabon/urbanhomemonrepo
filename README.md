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

# Copy environment
cp .env.example .env

# Start PostgreSQL
docker compose up postgres -d

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
└── docker-compose.yml
```

## API Overview

Public endpoints: `/api/services`, `/api/bookings`, `/api/contact`, `/api/team`, etc.

Admin endpoints: `/api/admin/*` (requires auth)

Team member: `/api/me/bookings`

## VPS Deployment

```bash
# On your VPS
git clone <repo>
cd urban-home-security
cp .env.example .env
# Edit .env with production values

docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run db:seed
```

### TLS with Certbot

```bash
# Install certbot, then update nginx config for SSL
certbot --nginx -d yourdomain.com
```

## Environment Variables

See [.env.example](.env.example) for all required variables.

## License

Private - Urban Home & Security
