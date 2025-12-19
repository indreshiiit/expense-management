#!/bin/bash

set -e

echo "Generating package-lock.json files..."
echo ""

echo "Generating backend package-lock.json..."
cd backend
npm install --package-lock-only
cd ..

echo "Generating frontend package-lock.json..."
cd frontend
npm install --package-lock-only
cd ..

echo "Generating root package-lock.json..."
npm install --package-lock-only

echo ""
echo "Package lock files generated successfully!"
echo ""
echo "You can now use 'npm ci' in Dockerfiles for faster, more reproducible builds."
