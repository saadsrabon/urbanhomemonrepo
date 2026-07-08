import path from 'path';
import { z } from 'zod';
import dotenv from 'dotenv';

const serverRoot = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.coerce.number().default(5242880),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  SEED_ADMIN_NAME: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('noreply@urbanhomeandsecurity.com'),
  ADMIN_NOTIFY_EMAIL: z.string().email().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const databaseUrl =
  parsed.data.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!databaseUrl) {
  console.error('Missing DATABASE_URL (or POSTGRES_URL from Vercel Neon integration)');
  process.exit(1);
}

process.env.DATABASE_URL = databaseUrl;

export const env = {
  ...parsed.data,
  DATABASE_URL: databaseUrl,
  UPLOAD_DIR: process.env.VERCEL ? '/tmp/uploads' : parsed.data.UPLOAD_DIR,
};
