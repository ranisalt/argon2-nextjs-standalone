FROM node:20-alpine3.18 AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .
# ENV NEXT_TELEMETRY_DISABLED 1

ENV ARGON2_PREBUILDS_GLOB="linux-*/*.musl.*"
RUN pnpm run build

# Production image, copy all the files and run next
FROM node:20-alpine3.18 AS runner

WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=1000:1000 /app/.next/standalone ./
COPY --from=builder --chown=1000:1000 /app/.next/static ./.next/static

USER 1000

EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" PORT="3000" node server.js
