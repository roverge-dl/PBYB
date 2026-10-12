import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // Database
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  // Redis
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),

  // Paystack
  PAYSTACK_SECRET_KEY: Env.schema.string(),
  PAYSTACK_PUBLIC_KEY: Env.schema.string.optional(),

  // AWS S3
  S3_BUCKET: Env.schema.string.optional(),
  S3_REGION: Env.schema.string.optional(),
  S3_ACCESS_KEY: Env.schema.string.optional(),
  S3_SECRET_KEY: Env.schema.string.optional(),

  // Session
  SESSION_DRIVER: Env.schema.string.optional(),

  // Google SSO
  GOOGLE_WEB_CLIENT_ID: Env.schema.string.optional(),

  // AWS SES
  AWS_SES_REGION: Env.schema.string.optional(),
  AWS_SES_SENDER: Env.schema.string.optional(),
  AWS_ACCESS_KEY_ID: Env.schema.string.optional(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string.optional(),
})
