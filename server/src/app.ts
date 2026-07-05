import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(pinoHttp());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowed = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (allowed.includes(origin) || allowed.includes('*')) {
        callback(null, true);
        return;
      }
      // Allow Vercel preview/production frontends during demo deployments
      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});
app.use('/api/auth/login', authLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
