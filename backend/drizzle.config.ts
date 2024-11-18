import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle-migrations',
  schema: './src/shared/persistence/drizzle/schemas.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://rayhan:rayhan123@localhost:5432/ostasks',
  },
});
