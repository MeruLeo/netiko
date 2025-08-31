import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import config from './config/config';

const productionMode = config.nodeEnv === 'production';

function startServer() {
  const port = config.port || 5000;
  app.listen(port, () => {
    console.log(
      `Server is running in ${
        productionMode ? 'production' : 'development'
      } mode on port ${port}`,
    );
  });
}

async function run() {
  await connectDB();
  startServer();
}

run();
