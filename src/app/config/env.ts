import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('9000'),

  // Database (supports legacy cluster_url + CENTRAL_DB_NAME)
  CLUSTER_URL: z.string().optional(),
  CENTRAL_DB_NAME: z.string().optional(),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters')
    .optional(),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters')
    .optional(),

  JWT_ACCESS_EXPIRES_IN: z.string().optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().optional(),

  VERSION: z.string().default('1.0.0'),
  ALLOWED_ORIGINS: z.string().optional(),
});

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CLUSTER_URL: process.env.CLUSTER_URL ?? process.env.cluster_url,
  CENTRAL_DB_NAME: process.env.CENTRAL_DB_NAME,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  VERSION: process.env.VERSION,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Environment validation failed. Check your .env configuration.');
}

const value = parsed.data;

const databaseUrl =
  value.CLUSTER_URL && value.CENTRAL_DB_NAME
    ? `${value.CLUSTER_URL}${value.CENTRAL_DB_NAME}`
    : value.CLUSTER_URL;

const allowedOrigins =
  value.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? [];

const env = {
  NODE_ENV: value.NODE_ENV,
  port: Number(value.PORT),
  version: value.VERSION,
  databaseUrl,
  dbName: value.CENTRAL_DB_NAME,
  jwtAccessSecret: value.JWT_ACCESS_SECRET,
  jwtRefreshSecret: value.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: value.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: value.JWT_REFRESH_EXPIRES_IN ?? '7d',
  allowedOrigins,
};

export default env;

