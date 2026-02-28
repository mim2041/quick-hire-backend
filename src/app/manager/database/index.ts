import mongoose from 'mongoose';
import env from '../../config/env';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!env.databaseUrl) {
    throw new Error('Database URL is not configured. Please set CLUSTER_URL and CENTRAL_DB_NAME.');
  }

  await mongoose.connect(env.databaseUrl);
  isConnected = true;
  // eslint-disable-next-line no-console
  console.log('✅ MongoDB connected');
};

export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  await mongoose.disconnect();
  isConnected = false;
  // eslint-disable-next-line no-console
  console.log('🛑 MongoDB disconnected');
};

