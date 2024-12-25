import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: [".env", ".env.local"],
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/backend/persistence/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
