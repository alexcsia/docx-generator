# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dev dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build bundle
RUN node esbuild.config.mjs

# Stage 2: Production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only bundle.js 
COPY --from=builder /app/dist/bundle.js ./bundle.js

# Expose HTTP port
EXPOSE 3001

# Run the service
CMD ["node", "bundle.js"]
