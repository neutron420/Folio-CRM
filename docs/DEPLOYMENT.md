# Production Deployment & Infrastructure

## 1. Overview & Cloud Architecture

Zelo Kanban is architected to deploy across modern cloud infrastructure with zero lock-in:

```
                                    +-----------------------+
                                    |     Cloudflare /      |
                                    |   Edge CDN & WAF      |
                                    +-----------+-----------+
                                                |
                       +------------------------+------------------------+
                       | HTTPS Traffic                                   | HTTPS & WSS Traffic
                       v                                                 v
           +-----------------------+                         +-----------------------+
           |   Frontend (Next.js)  |                         |    Backend Gateway    |
           |   Vercel / Node.js    |                         |  Bun Container (Fly,  |
           |     Container         |                         |  Render, AWS ECS)     |
           +-----------------------+                         +-----------+-----------+
                                                                         |
                                                              +----------+----------+
                                                              |                     |
                                                              v                     v
                                                   +--------------------+ +--------------------+
                                                   | Neon PostgreSQL    | | S3 / Cloudflare R2 |
                                                   | (Pooled + Direct)  | | File Attachments   |
                                                   +--------------------+ +--------------------+
```

---

## 2. Infrastructure Components

### 2.1 Backend API & WebSocket Server
- **Runtime**: Bun in minimal Linux container (`oven/bun:1-alpine`).
- **Port**: Exposed on port `4000` (or `PORT` environment variable).
- **Reverse Proxy / Ingress**: Nginx, Caddy, or Cloudflare Tunnel terminating TLS 1.3 and forwarding `Upgrade` headers:
  ```nginx
  location /ws {
      proxy_pass http://backend:4000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "Upgrade";
      proxy_set_header Host $host;
      proxy_read_timeout 86400s;
  }
  ```

### 2.2 Frontend (Next.js 16)
- Can be deployed to **Vercel** or containerized with standalone Next.js server output.
- Configured with `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`.

### 2.3 Database (Neon PostgreSQL)
- **High Concurrency**: APIs use the PgBouncer pooled connection (`DATABASE_URL`).
- **DDL Migrations**: Deployment scripts use the direct unpooled endpoint (`DIRECT_URL`).

---

## 3. Database Migration Pipeline

Migrations must never run concurrently from multiple web instances. The deployment pipeline applies migrations prior to rolling out new containers:

```bash
# In CI/CD deployment step:
bun run --filter @kanban/db prisma migrate deploy
```

---

## 4. Health Checks & Observability

### Endpoints
- `GET /health` -> Basic liveness check (responds `200 OK` if process is healthy).
- `GET /health/ready` -> Readiness probe that executes a `SELECT 1` ping against PostgreSQL.

```json
{
  "status": "ok",
  "version": "1.0.0",
  "database": "connected",
  "uptime": 1420.5
}
```

### Graceful Shutdown
The Bun server listens for `SIGTERM` and `SIGINT`:
1. Ceases accepting new HTTP and WebSocket connections.
2. Broadcasts disconnect notices to active WebSocket rooms.
3. Drains in-flight database transactions (timeout: 10s).
4. Closes Prisma database connection pool.
5. Exits process with code `0`.
