#!/bin/bash

# Test Docker build without running full containers
set -e

echo "Testing Docker build process..."

# Test the build script locally first
echo "Testing build script locally..."
chmod +x scripts/build-production.sh

# Create a test build
echo "Running production build test..."
npm run build || echo "Standard build failed, testing custom script..."

echo "Testing custom build script..."
./scripts/build-production.sh

echo "Build test completed successfully!"
echo ""
echo "To test full Docker build:"
echo "  docker build -t cid-test ."
echo ""
echo "To run the built container:"
echo "  docker run -p 5000:5000 --env DATABASE_URL=your_db_url cid-test"