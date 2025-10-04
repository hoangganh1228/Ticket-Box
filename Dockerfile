# ---------- Build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Build tools cho native deps
RUN apk add --no-cache python3 make g++

# Cài đầy đủ để build source
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Build mã nguồn
COPY . .
RUN yarn build

# Chuẩn bị node_modules chỉ cho production (đã có build tools)
RUN yarn install --frozen-lockfile --production=true

# ---------- Runtime stage ----------
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy prod deps và dist đã build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/src/main"]