#!/bin/bash

# Production build script for CID Telangana
set -e

echo "Starting production build..."

# Build frontend with Vite
echo "Building frontend..."
npx vite build

# Build backend with esbuild, excluding Vite dependencies
echo "Building backend..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --external:vite \
  --external:@vitejs/plugin-react \
  --external:@replit/vite-plugin-cartographer \
  --external:@replit/vite-plugin-runtime-error-modal

echo "Production build completed successfully!"
echo "Built files:"
echo "  - Frontend: dist/ (client assets)"
echo "  - Backend: dist/index.js (server bundle)"