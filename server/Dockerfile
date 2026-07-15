FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/
RUN npm ci -w server --ignore-scripts

COPY server ./server
WORKDIR /app/server
RUN npm run db:generate && npm run build

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY server/prisma ./server/prisma
RUN npm ci -w server --omit=dev --ignore-scripts

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

WORKDIR /app/server
RUN mkdir -p uploads

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4000/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
