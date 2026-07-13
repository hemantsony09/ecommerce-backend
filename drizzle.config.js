import { env } from "./src/config/env.js";
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});