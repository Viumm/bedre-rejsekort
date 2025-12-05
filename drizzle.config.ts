import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/database/schema.ts",
  out: "./src/lib/database",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

