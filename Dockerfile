# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app
RUN npm install --global pnpm@12.17.0

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
# Build-time values are placeholders; private env is read at runtime by adapter-node.
RUN DATABASE_URL="postgres://build:build@127.0.0.1:5432/build" \
    ORIGIN="http://localhost:3000" \
    BETTER_AUTH_SECRET="build-only-secret-build-only-secret" \
    pnpm build \
    && pnpm exec esbuild src/lib/server/db/seed.ts --bundle --platform=node --format=esm \
       --outfile=docker/seed.mjs --packages=external --alias:#lib=./src/lib \
    && pnpm exec esbuild src/lib/server/db/create-admin.ts --bundle --platform=node --format=esm \
       --outfile=docker/create-admin.mjs --packages=external --alias:#lib=./src/lib

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    BODY_SIZE_LIMIT=80M \
    UPLOAD_DIR=/app/uploads \
    RUN_MIGRATIONS=true \
    SEED_ON_START=false \
    CREATE_ADMIN_ON_START=false

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/docker ./docker
COPY --from=build /app/package.json ./package.json

RUN mkdir -p /app/uploads \
    && chmod +x /app/docker/entrypoint.sh \
    && chown -R node:node /app

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/id').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["/app/docker/entrypoint.sh"]
CMD ["node", "build"]
