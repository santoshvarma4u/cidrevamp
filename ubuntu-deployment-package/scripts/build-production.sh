#!/bin/bash

# Production build script for CID Application
set -e

echo "🔧 Starting production build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are we in the right directory?"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

# Build the application
echo "🏗️  Building application..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy server files to dist (since this is a Node.js app, not a build process)
echo "📁 Preparing server files..."
cp -r server dist/
cp -r shared dist/

# Copy other necessary files
if [ -f "drizzle.config.ts" ]; then
    cp drizzle.config.ts dist/
fi

if [ -d "uploads" ]; then
    cp -r uploads dist/
fi

echo "✅ Production build completed successfully!"
echo "📁 Built files are in the dist/ directory"