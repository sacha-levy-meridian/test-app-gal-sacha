FROM node:22-alpine AS builder
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json* .npmrc ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* .npmrc ./
RUN npm ci --omit=dev && npm cache clean --force \
  && rm -rf node_modules/@esbuild node_modules/esbuild \
  && rm -rf /usr/local/lib/node_modules/npm

COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "node_modules/.bin/prisma generate && node_modules/.bin/prisma migrate deploy && node_modules/.bin/react-router-serve ./build/server/index.js"]
