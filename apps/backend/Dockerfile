FROM oven/bun:1.3.14 AS base
WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock turbo.json ./
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

RUN bun install --frozen-lockfile

WORKDIR /app/packages/db
RUN bunx prisma generate --schema=./prisma/schema.prisma

WORKDIR /app/apps/backend

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["bun", "run", "src/server.ts"]
