import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();