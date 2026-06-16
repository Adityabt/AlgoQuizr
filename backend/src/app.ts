import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import quizRoutes from './routes/quizRoutes';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/quiz', quizRoutes);

  return app;
}