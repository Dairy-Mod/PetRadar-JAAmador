import 'dotenv/config';
import * as env from 'env-var';

const mailerEmail = env.get('MAILER_EMAIL').required().asString();

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  MAILER_EMAIL: mailerEmail,
  MAILER_PASSWORD: env.get('MAILER_PASSWORD').required().asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAPBOX_TOKEN: env.get('MAPBOX_TOKEN').required().asString(),
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),
  DB_PORT: env.get('DB_PORT').required().asPortNumber(),
  DB_USER: env.get('DB_USER').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  NOTIFICATION_EMAIL: env.get('NOTIFICATION_EMAIL').default(mailerEmail).asString(),
  REDIS_URL: env.get('REDIS_URL').default('redis://localhost:6379').asString(),
  CACHE_TTL_SECONDS: env.get('CACHE_TTL_SECONDS').default(60).asIntPositive(),
  APPLICATIONINSIGHTS_CONNECTION_STRING: env
    .get('APPLICATIONINSIGHTS_CONNECTION_STRING')
    .default('')
    .asString(),
};
