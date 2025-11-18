# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN node esbuild.config.mjs

# Stage 2:run
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist/bundle.js ./bundle.js

EXPOSE 3001

CMD ["node", "bundle.js"]
