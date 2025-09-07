import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import config from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import { clerkMiddleware } from '@clerk/express';

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import projectRoutes from './routes/project.routes';
import workExpRoutes from './routes/workExp.routes';
import eductionRoutes from './routes/eduction.routes';
import achievementRoutes from './routes/achievement.routes';

const app: Express = express();

const productionMode = config.nodeEnv === 'production';

app.use(express.json({ limit: '50kb' }));
app.use('/imgs/projects', express.static(path.join(__dirname, '../uploads')));

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
app.use('/v1/projects', projectRoutes);
app.use('/v1/work-exp', workExpRoutes);
app.use('/v1/eduction', eductionRoutes);
app.use('/v1/achievement', achievementRoutes);

app.use(errorHandler);

export default app;
