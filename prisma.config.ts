import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Plain process.env (not the `env()` helper) so `prisma generate` can run during
    // build even before DATABASE_URL is available — it doesn't need a live connection.
    // `prisma migrate deploy` / the running app still require it to be set for real.
    url: process.env.DATABASE_URL,
  },
});
