# ----------------------------------------------------
# Stage 1: Build NestJS Application
# ----------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ----------------------------------------------------
# Stage 2: Production Runner
# ----------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Non-root user for security best practices
USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
