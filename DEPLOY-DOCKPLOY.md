# Deploy on Dockploy (Docker Compose)

This branch is configured for [Dockploy](https://dockploy.com/) Compose deployments. Nginx routes traffic on one domain:

- `/` → Next.js frontend
- `/api/` → Express API
- `/uploads/` → uploaded files

## Prerequisites

- A VPS with Dockploy installed
- A domain pointed at the VPS (A record)
- Git repository access from Dockploy

## 1. Create the Compose service

1. In Dockploy, create a **Project** → **Compose** service.
2. Set **Compose Type** to **Docker Compose** (not Stack).
3. Connect this repository and select branch **`dockploy-deploy`**.
4. Set **Compose Path** to `./docker-compose.yml`.

## 2. Environment variables

Open the **Environment** tab and paste values from [`.env.example`](.env.example). At minimum, set:

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | Strong database password |
| `JWT_ACCESS_SECRET` | Min 32 characters |
| `JWT_REFRESH_SECRET` | Min 32 characters |
| `CORS_ORIGIN` | Your public URL, e.g. `https://your-domain.com` |
| `NEXT_PUBLIC_API_URL` | `/api` when using the bundled nginx router |

Dockploy writes these to a `.env` file next to `docker-compose.yml`. The compose file references them explicitly so they reach each container.

## 3. Configure the domain

Use the **Domains** tab (recommended):

1. Add a domain, e.g. `your-domain.com`.
2. Point it to the **nginx** service on port **80**.
3. Enable HTTPS (Let's Encrypt).

Do **not** bind host ports in the compose file; Dockploy's Traefik handles routing via `dokploy-network`.

## 4. Deploy

Click **Deploy** and wait for all services to become healthy. The API runs `prisma migrate deploy` on startup.

### First-time database seed

After the first successful deploy, seed admin users once:

```bash
docker compose exec api npm run db:seed
```

Run this from the Dockploy compose shell/terminal, or via SSH on the host in the compose project directory.

Default credentials are in the root [README.md](README.md).

## 5. Rebuild after env changes

If you change `NEXT_PUBLIC_API_URL`, trigger a **rebuild** of the **web** service (it is baked in at build time).

## Local testing (optional)

To test this stack locally without Dockploy's network:

```bash
docker network create dokploy-network 2>/dev/null || true
cp .env.example .env
# Edit .env with local values

docker compose up -d --build
docker compose exec api npm run db:seed
```

Visit http://localhost — you will need to temporarily add `ports: ["8080:80"]` under `nginx` for local access, or configure a domain in Dockploy only.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `dokploy-network not found` | Deploy from Dockploy (creates the network) or run `docker network create dokploy-network` locally |
| API unhealthy | Check `POSTGRES_PASSWORD` and JWT secrets in Environment tab |
| Frontend can't reach API | Ensure `NEXT_PUBLIC_API_URL=/api` and domain is routed to **nginx**, not **web** |
| Uploads missing after redeploy | Uploads use the `uploads_data` named volume — do not remove volumes on redeploy |
| CORS errors | Set `CORS_ORIGIN` to your exact public URL (no trailing slash) |

## Architecture

```
Internet → Traefik (Dockploy) → nginx:80
                                    ├── /api/*  → api:4000
                                    ├── /uploads/* → volume
                                    └── /*      → web:3000
                              postgres:5432 (internal)
```

## Differences from `main`

- Monorepo-aware Docker builds (root `package-lock.json`)
- `dokploy-network` on all services
- No host port bindings (Traefik handles ingress)
- Nginx config baked into image (no bind mount — survives git-based redeploys)
- Healthchecks on postgres, api, web, and nginx
