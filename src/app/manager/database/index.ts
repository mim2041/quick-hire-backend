import mongoose from 'mongoose';
import env from '../../config/env';
import { logger } from '../logger';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!env.databaseUrl) {
    throw new Error('Database URL is not configured. Please set CLUSTER_URL and CENTRAL_DB_NAME.');
  }

  try {
    await mongoose.connect(env.databaseUrl);
    isConnected = true;
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${(error as Error).message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('🛑 MongoDB disconnected');
  } catch (error) {
    logger.error(`❌ MongoDB disconnect failed: ${(error as Error).message}`);
  }
};


