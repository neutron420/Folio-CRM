import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),

  // Database (Neon PostgreSQL)
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),

  // Sessions & Security
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  SESSION_COOKIE_NAME: z.string().default("zelo_session"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().default("placeholder-google-client-id"),
  GOOGLE_CLIENT_SECRET: z.string().default("placeholder-google-client-secret"),
  GOOGLE_CALLBACK_URL: z.string().default("http://localhost:4000/api/v1/auth/google/callback"),

  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string().default("placeholder-github-client-id"),
  GITHUB_CLIENT_SECRET: z.string().default("placeholder-github-client-secret"),
  GITHUB_CALLBACK_URL: z.string().default("http://localhost:4000/api/v1/auth/github/callback"),

  // Network & CORS
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Environment validation error:", JSON.stringify(result.error.format(), null, 2));
    throw new Error("Invalid application environment configuration");
  }

  cachedEnv = result.data;
  return cachedEnv;
}
