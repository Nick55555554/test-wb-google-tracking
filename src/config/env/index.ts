// src/config/env/index.ts
import { config } from 'dotenv';
import { z } from 'zod';

config({ path: '.env' }); 

const envSchema = z.object({
    POSTGRES_HOST: z.string().optional().default('localhost'),
    POSTGRES_PORT: z.string().optional().default('5432'),
    POSTGRES_DB: z.string().optional().default('postgres'),
    POSTGRES_USER: z.string().optional().default('postgres'),
    POSTGRES_PASSWORD: z.string().optional().default('postgres'),
    NODE_ENV: z.string().optional().default('development'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.warn('Env validation warnings:', result.error);
}

export default result.success ? result.data : {
  POSTGRES_HOST: 'localhost',
  POSTGRES_PORT: '5432',
  POSTGRES_DB: 'postgres',
  POSTGRES_USER: 'postgres',
  POSTGRES_PASSWORD: 'postgres',
  NODE_ENV: 'development',
};