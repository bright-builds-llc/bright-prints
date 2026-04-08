FROM oven/bun:1.3.9-alpine AS base
WORKDIR /app

FROM base AS development-dependencies-env
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build-env
COPY . .
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
RUN bunx prisma generate && bun run build

FROM base AS production-dependencies-env
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json bun.lock ./
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build-env /app/build /app/build
COPY content /app/content
COPY public /app/public
CMD ["node", "./node_modules/@react-router/serve/dist/cli.js", "./build/server/index.js"]
