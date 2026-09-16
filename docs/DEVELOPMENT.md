# Local Development Guide

## 1. Prerequisites

Ensure you have the following installed on your system:
- **Bun**: v1.2+ (`bun --version`)
- **Node.js**: v20+ or v24+ (required by some Next.js build tools and Turborepo)
- **Git**: v2.40+
- **Neon Account**: Access to a Neon Serverless PostgreSQL instance (free tier available at [neon.tech](https://neon.tech))

---

## 2. Quickstart

### 2.1 Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/neutron420/Zelo.git
cd Zelo

# Install all workspace dependencies via Bun
bun install
```

### 2.2 Environment Configuration
Copy the sample environment file to `.env` in the root:
```bash
cp .env.example .env
```
Open `.env` and fill in your Neon database connection strings and OAuth credentials.

### 2.3 Database Setup & Migrations
```bash
# Generate Prisma Client types
bun run --filter @kanban/db db:generate

# Push schema and create migration in Neon
bun run --filter @kanban/db db:migrate

# Seed database with realistic Kanban demo data
bun run --filter @kanban/db db:seed
```

### 2.4 Running the Development Environment
Launch the full Turborepo pipeline (Next.js frontend + Bun backend):
```bash
bun run dev
```

The services will start on:
- **Frontend App**: `http://localhost:3000`
- **Backend API & WS Gateway**: `http://localhost:4000`
- **API Health Check**: `http://localhost:4000/health`

---

## 3. Development Commands Reference

| Command | Action | Scope |
| :--- | :--- | :--- |
| `bun run dev` | Starts all apps in watch mode via Turborepo | Root |
| `bun run build` | Builds all packages and applications | Root |
| `bun run lint` | Runs ESLint across all workspaces | Root |
| `bun run format` | Runs Prettier format across all files | Root |
| `bun run check-types`| Verifies TypeScript types with no emit | Root |
| `bun run test` | Runs Vitest unit and integration suites | Root |

### Package-Specific Filtering
To execute commands within a single workspace:
```bash
# Run tests only in backend
bun --filter backend test

# Run Prisma Studio against Neon DB
bun --filter @kanban/db prisma studio
```

---

## 4. Database Workflow with Neon & Prisma

1. **Schema Modifications**:
   Edit `packages/db/prisma/schema.prisma`.
2. **Apply Migration Locally**:
   ```bash
   bun run --filter @kanban/db db:migrate --name add_task_sprints
   ```
3. **Regenerate Client**:
   ```bash
   bun run --filter @kanban/db db:generate
   ```
4. **Inspect Data**:
   ```bash
   bun run --filter @kanban/db prisma studio
   ```

---

## 5. Troubleshooting & Tips

### Database Connection Pooler Issues
- If migrations hang, ensure `DIRECT_URL` points directly to the compute endpoint (not the connection pooler with `pgbouncer=true`). Prisma DDL migrations require direct TCP connections.

### Port Conflicts
- Default backend port is `4000`. If this port is occupied, specify `PORT=4001` in your `.env`.
