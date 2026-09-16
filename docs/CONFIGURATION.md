# Configuration & Environment Management

## 1. Overview & Strategy

Configuration in Zelo is managed centrally through the shared `@kanban/config` package. Environment variables are strictly validated at application startup using **Zod**. If any required environment variable is missing, malformed, or insecure, the server fails fast with clear diagnostics.

---

## 2. Environment Schema Specification

```typescript
// packages/config/src/index.ts
import { z } from "zod";

export const envSchema = z.object({
  // Runtime & Node
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),

  // Database (Neon PostgreSQL)
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid PostgreSQL connection string"),

  // Session & Security
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  SESSION_COOKIE_NAME: z.string().default("zelo_session"),
  COOKIE_DOMAIN: z.string().optional(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z.string().url("GOOGLE_CALLBACK_URL must be a valid URL"),

  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
  GITHUB_CALLBACK_URL: z.string().url("GITHUB_CALLBACK_URL must be a valid URL"),

  // Network & CORS
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  // Optional External Integrations
  REDIS_URL: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function loadConfig(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    process.exit(1);
  }
  return result.data;
}
```

---

## 3. Environment Variables Reference Table

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | No | `development` | Runtime environment (`development`, `test`, `production`) |
| `PORT` | No | `4000` | Port for Bun HTTP and WebSocket server |
| `DATABASE_URL` | **Yes** | - | Pooled Neon PostgreSQL connection URL (PgBouncer) |
| `DIRECT_URL` | **Yes** | - | Direct unpooled Neon connection URL (for Prisma migrations) |
| `SESSION_SECRET` | **Yes** | - | 32+ character key used to sign and encrypt session cookies |
| `SESSION_COOKIE_NAME` | No | `zelo_session` | Name of the session cookie sent to the browser |
| `GOOGLE_CLIENT_ID` | **Yes** | - | Google OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET`| **Yes** | - | Google OAuth Client Secret |
| `GOOGLE_CALLBACK_URL` | **Yes** | `.../api/v1/auth/google/callback` | Authorized redirect URI for Google OAuth |
| `GITHUB_CLIENT_ID` | **Yes** | - | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET`| **Yes** | - | GitHub OAuth App Client Secret |
| `GITHUB_CALLBACK_URL` | **Yes** | `.../api/v1/auth/github/callback` | Authorized callback URL for GitHub OAuth |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Allowed origin header for cross-origin requests |
| `FRONTEND_URL` | No | `http://localhost:3000` | Frontend base URL for post-login redirects |

---

## 4. Example Template (`.env.example`)

```env
# Runtime
NODE_ENV=development
PORT=4000

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://zelo_user:password@ep-pooler.us-east-2.aws.neon.tech/zelo_db?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://zelo_user:password@ep-direct.us-east-2.aws.neon.tech/zelo_db?sslmode=require"

# Session Security
SESSION_SECRET="change-this-to-a-super-secret-random-32-character-string"
SESSION_COOKIE_NAME="zelo_session"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/api/v1/auth/google/callback"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:4000/api/v1/auth/github/callback"

# CORS & Frontend
CORS_ORIGIN="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
```
