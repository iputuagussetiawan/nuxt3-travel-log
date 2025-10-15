import { defineConfig } from 'drizzle-kit'
import 'dotenv/config';

export default defineConfig({
    schema: './server/database/schemas/schema.ts',
    out: './server/database/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
})