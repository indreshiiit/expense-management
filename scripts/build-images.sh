#!/bin/bash

set -e

REGISTRY=${DOCKER_REGISTRY:-""}
TAG=${IMAGE_TAG:-"latest"}

echo "Building Docker images..."

if [ -n "$REGISTRY" ]; then
    BACKEND_IMAGE="$REGISTRY/expense-tracker-backend:$TAG"
    FRONTEND_IMAGE="$REGISTRY/expense-tracker-frontend:$TAG"
else
    BACKEND_IMAGE="expense-tracker-backend:$TAG"
    FRONTEND_IMAGE="expense-tracker-frontend:$TAG"
fi

echo "Building backend image: $BACKEND_IMAGE"
docker build -t $BACKEND_IMAGE -f backend/Dockerfile backend/

echo "Building frontend image: $FRONTEND_IMAGE"
docker build -t $FRONTEND_IMAGE -f frontend/Dockerfile frontend/

if [ -n "$REGISTRY" ]; then
    echo "Pushing images to registry..."
    docker push $BACKEND_IMAGE
    docker push $FRONTEND_IMAGE
fi

echo "Build complete!"
echo "Backend image: $BACKEND_IMAGE"
echo "Frontend image: $FRONTEND_IMAGE"
