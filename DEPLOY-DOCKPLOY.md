# Deploy on Dockploy (Docker Compose)

Deploy the full stack on a VPS using [Dockploy](https://dockploy.com/). One domain serves everything through nginx:

| Path | Service |
|------|---------|
| `/` | Next.js frontend |
| `/api/` | Express API |
| `/uploads/` | Uploaded images (persistent volume) |

**Use the `main` branch** — it includes the latest site, admin, chatbot, and SEO updates.

---

## Prerequisites

- VPS (Ubuntu 22.04+ recommended, 2 GB+ RAM)
- [Dockploy installed](https://docs.dockploy.com/) on the VPS
- Domain name with an **A record** pointing to the VPS IP
- GitHub repo: `https://github.com/saadsrabon/urbanhomemonrepo`

---

## Step 1 — Create a Dockploy project

1. Log in to Dockploy on your VPS (usually `http://YOUR_VPS_IP:3000`).
2. Create a **Project** (e.g. `urban-home-security`).
3. Inside the project, add a **Compose** service.
4. Set **Compose Type** to **Docker Compose** (not Docker Stack).

---

## Step 2 — Connect GitHub

1. Open the Compose service → **General** / **Source**.
2. Connect your Git provider and select repository **`urbanhomemonrepo`**.
3. Set **Branch** to **`main`**.
4. Set **Compose Path** to:

   ```
   ./docker-compose.yml
   ```

5. Save.

---

## Step 3 — Environment variables

Open the **Environment** tab and add these (copy from [`.env.example`](.env.example)):

### Required

| Variable | Example | Notes |
|----------|---------|-------|
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | *(strong random password)* | **Required** — compose fails without it |
| `POSTGRES_DB` | `urban_home_security` | Database name |
| `JWT_ACCESS_SECRET` | *(32+ random chars)* | **Required** |
| `JWT_REFRESH_SECRET` | *(32+ random chars)* | **Required** |
| `CORS_ORIGIN` | `https://yourdomain.com` | Exact public URL, no trailing slash |
| `NEXT_PUBLIC_API_URL` | `/api` | Relative path — nginx proxies to API |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Used for SEO, sitemap, OG tags |

### Recommended

| Variable | Example |
|----------|---------|
| `SEED_ADMIN_EMAIL` | `admin@urbanhomeandsecurity.com` |
| `SEED_ADMIN_PASSWORD` | *(change from default)* |
| `SEED_ADMIN_NAME` | `Super Admin` |
| `ADMIN_NOTIFY_EMAIL` | `info@urbanhomeandsecurity.com` |

### Optional (email)

`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

Generate secrets (run locally):

```bash
openssl rand -hex 32   # use for JWT_ACCESS_SECRET
openssl rand -hex 32   # use for JWT_REFRESH_SECRET
```

> **Important:** Changing `NEXT_PUBLIC_*` variables requires a **rebuild** of the **web** container (they are baked in at build time).

---

## Step 4 — Configure domain & HTTPS

1. Open the Compose service → **Domains**.
2. Add your domain, e.g. `yourdomain.com` (and `www.yourdomain.com` if needed).
3. Route traffic to the **`nginx`** service on port **80**.
4. Enable **HTTPS** (Let's Encrypt) in Dockploy.

Do **not** expose host ports in `docker-compose.yml` — Dockploy's Traefik handles ingress via the external `dokploy-network`.

---

## Step 5 — Deploy

1. Click **Deploy** (or **Redeploy**).
2. Wait for all services to become healthy:
   - `postgres` — database
   - `api` — runs `prisma migrate deploy` on startup
   - `web` — Next.js production build
   - `nginx` — reverse proxy

First build may take **5–10 minutes** (Next.js compile).

---

## Step 6 — Seed the database (first time only)

After the first successful deploy, seed admin users and demo content:

**Option A — Dockploy terminal**

Open the Compose service terminal and run:

```bash
docker compose exec api npm run db:seed
```

**Option B — SSH on VPS**

```bash
cd /path/to/dockploy/compose/project
docker compose exec api npm run db:seed
```

### Default login

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@urbanhomeandsecurity.com` | `Admin@123456` |
| Manager | `manager@urbanhomeandsecurity.com` | `Manager@123456` |

**Change the admin password immediately** after first login.

---

## Step 7 — Verify

| Check | URL |
|-------|-----|
| Homepage | `https://yourdomain.com` |
| Admin | `https://yourdomain.com/admin` |
| API health | `https://yourdomain.com/api/settings` |
| Uploads | Upload an image in admin → should load at `/uploads/...` |

---

## Updating after code changes

1. Push changes to **`main`** on GitHub.
2. In Dockploy, click **Deploy** / **Redeploy** on the Compose service.
3. If you changed `NEXT_PUBLIC_*` env vars, **rebuild** the **web** service.

---

## Architecture

```
Internet
   ↓
Traefik (Dockploy)
   ↓
nginx:80
   ├── /api/*     → api:4000
   ├── /uploads/* → uploads_data volume
   └── /*         → web:3000

postgres:5432 (internal only)
```

### Persistent volumes

| Volume | Purpose |
|--------|---------|
| `postgres_data` | Database |
| `uploads_data` | Admin-uploaded images |

**Do not delete volumes on redeploy** or you will lose uploads and database data.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `dokploy-network not found` | Deploy from Dockploy (creates network) or `docker network create dokploy-network` |
| API container unhealthy | Check `POSTGRES_PASSWORD`, JWT secrets in Environment tab |
| Frontend blank / API errors | Ensure domain routes to **nginx**, not **web** directly |
| `NEXT_PUBLIC_API_URL` wrong | Set to `/api`, rebuild **web** |
| CORS errors | `CORS_ORIGIN` must match exact site URL (https, no trailing slash) |
| Uploads missing after redeploy | Don't remove `uploads_data` volume |
| Build fails on web | Check Dockploy build logs; ensure enough RAM (2 GB+) |
| Old content after deploy | Run `docker compose exec api npm run db:seed` to refresh seed data |

---

## Local testing (optional)

```bash
docker network create dokploy-network 2>/dev/null || true
cp .env.example .env
# Edit .env — for local testing add ports to nginx temporarily

docker compose up -d --build
docker compose exec api npm run db:seed
```

For local browser access, temporarily add under `nginx` in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"
```

Then visit http://localhost:8080

---

## Differences from Vercel demo

| | VPS (Dockploy) | Vercel |
|--|----------------|--------|
| Database | PostgreSQL in Docker | Neon (external) |
| Uploads | Persistent volume | Ephemeral `/tmp` |
| API URL | `/api` (same domain) | Separate API subdomain |
| Branch | `main` | `design` (optional) |

Use **Dockploy + VPS** for production with persistent uploads and full control.
