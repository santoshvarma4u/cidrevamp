# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Install build dependencies for canvas and native modules
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Set working directory
WORKDIR /app

# Set Python path for node-gyp
ENV PYTHON=/usr/bin/python3

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Development stage
FROM node:20-alpine AS development

# Install runtime dependencies for canvas and other native modules
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Set working directory
WORKDIR /app

# Set Python path for node-gyp
ENV PYTHON=/usr/bin/python3

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Create required directories
RUN mkdir -p uploads logs/reports

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
  http.get('http://127.0.0.1:5000/api/health', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1); \
  }).on('error', () => process.exit(1));"

# Start the application in development mode
CMD ["npm", "run", "start"]

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies for canvas and other native modules
RUN apk add --no-cache \
    dumb-init \
    python3 \
    py3-pip \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set Python path for node-gyp
ENV PYTHON=/usr/bin/python3

# Install all dependencies (including tsx for running TypeScript)
RUN npm ci && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/shared ./shared
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# Create required directories
RUN mkdir -p uploads logs/reports && chown -R nextjs:nodejs uploads logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
  http.get('http://127.0.0.1:5000/api/health', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1); \
  }).on('error', () => process.exit(1));"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
