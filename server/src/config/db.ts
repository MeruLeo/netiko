import { logger } from '#src/middlewares/logger.js';
import { ENV } from './env.js';
import mongoose from 'mongoose';

async function connectToDB() {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    logger.info(`connected to db on ${mongoose.connection.host}, port: ${mongoose.connection.port}`);
  } catch (error) {
    logger.error(`Failed to connect to database: ${error}`);
  }
}

export default connectToDB;
