#!/usr/bin/env bash
# One-time Vercel deployment setup for Urban Home & Security demo
set -euo pipefail

SCOPE="saadsrabons-projects"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

JWT_ACCESS="$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
JWT_REFRESH="$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"

echo "=== Urban Home & Security — Vercel Deploy ==="
echo ""
echo "You need a cloud PostgreSQL URL (Neon free tier recommended):"
echo "  1. Go to https://neon.tech and create a project"
echo "  2. Copy the connection string (postgresql://...)"
echo ""
read -r -p "Paste DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is required."
  exit 1
fi

echo ""
echo "Deploying API first..."
cd "$ROOT/server"

add_env() {
  local name="$1"
  local value="$2"
  printf '%s' "$value" | vercel env add "$name" production --scope "$SCOPE" --force 2>/dev/null || \
  printf '%s' "$value" | vercel env add "$name" production --scope "$SCOPE"
}

add_env DATABASE_URL "$DATABASE_URL"
add_env NODE_ENV "production"
add_env JWT_ACCESS_SECRET "$JWT_ACCESS"
add_env JWT_REFRESH_SECRET "$JWT_REFRESH"
add_env JWT_ACCESS_EXPIRES "15m"
add_env JWT_REFRESH_EXPIRES "7d"
add_env CORS_ORIGIN "https://urban-home-security-web.vercel.app"
add_env SEED_ADMIN_EMAIL "admin@urbanhomeandsecurity.com"
add_env SEED_ADMIN_PASSWORD "Admin@123456"
add_env SEED_ADMIN_NAME "Super Admin"

API_URL=$(vercel deploy --prod --yes --scope "$SCOPE" 2>&1 | tail -1)
echo "API deployed: $API_URL"

echo ""
echo "Deploying frontend..."
cd "$ROOT/web"

add_env NEXT_PUBLIC_API_URL "${API_URL}/api"

WEB_URL=$(vercel deploy --prod --yes --scope "$SCOPE" 2>&1 | tail -1)
echo "Web deployed: $WEB_URL"

echo ""
echo "Updating API CORS to match frontend URL..."
cd "$ROOT/server"
add_env CORS_ORIGIN "$WEB_URL"
vercel deploy --prod --yes --scope "$SCOPE" >/dev/null

echo ""
echo "=== Done ==="
echo "Website:  $WEB_URL"
echo "API:      $API_URL"
echo "Admin:    $WEB_URL/admin"
echo "Login:    admin@urbanhomeandsecurity.com / Admin@123456"
