import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import config from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import { clerkMiddleware } from '@clerk/express';

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';

const app: Express = express();

const productionMode = config.nodeEnv === 'production';

app.use(express.json({ limit: '50kb' }));

app.use(
  cors({
    origin: productionMode ? config.origions.product : config.origions.local,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(helmet());

app.use(cookieParser());

if (!productionMode) {
  app.use(morgan('dev'));
}

app.use(clerkMiddleware());

app.use('/v1/auth', authRoutes);
app.use('/v1/profile', profileRoutes);

app.use(errorHandler);

export default app;
