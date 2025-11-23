# ===== BUILDER =====
FROM node:20-alpine AS builder

WORKDIR /app

# Inject ENV sebelum build
ARG NEXT_PUBLIC_API
ENV NEXT_PUBLIC_API=$NEXT_PUBLIC_API

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ===== RUNNER =====
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3001
CMD ["npm", "start"]
