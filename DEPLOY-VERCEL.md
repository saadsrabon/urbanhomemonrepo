# Vercel Demo Deployment

Deploy **frontend** and **backend** as two separate Vercel projects (VPS setup on `main` stays unchanged).

## Projects

| App | Vercel project | Root folder |
|-----|----------------|-------------|
| API | `urban-home-security-api` | `server/` |
| Web | `urban-home-security-web` | `web/` |

## 1. Database (Neon — free)

1. Open [neon.tech](https://neon.tech) → New project → `urban-home-security`
2. Copy the **pooled** connection string (`postgresql://...`)

## 2. Link Neon to the API project

In [Vercel Dashboard](https://vercel.com) → **urban-home-security-api** → Storage → **Connect Neon**  
(or set `DATABASE_URL` manually to your Neon connection string)

## 3. Set API env vars

In **urban-home-security-api** → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon connection string |
| `NODE_ENV` | `production` |
| `JWT_ACCESS_SECRET` | 32+ char random string |
| `JWT_REFRESH_SECRET` | 32+ char random string |
| `CORS_ORIGIN` | `https://urban-home-security-web.vercel.app` |
| `SEED_ADMIN_EMAIL` | `admin@urbanhomeandsecurity.com` |
| `SEED_ADMIN_PASSWORD` | `Admin@123456` |

## 4. Deploy API

```bash
cd server
vercel deploy --prod --scope saadsrabons-projects
```

Note the production URL (e.g. `https://urban-home-security-api.vercel.app`).

## 5. Set Web env var

In **urban-home-security-web** → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://urban-home-security-api.vercel.app/api` |

## 6. Deploy Web

```bash
cd web
vercel deploy --prod --scope saadsrabons-projects
```

## 7. Update CORS (if web URL differs)

Set `CORS_ORIGIN` on the API project to your final web URL, then redeploy API.

---

**Admin login:** `/admin` → `admin@urbanhomeandsecurity.com` / `Admin@123456`

**Note:** Image uploads on Vercel use `/tmp` (not persistent). Placeholder images work fine for client demos.

## Quick deploy script

After Neon is ready:

```bash
bash scripts/deploy-vercel.sh
```
