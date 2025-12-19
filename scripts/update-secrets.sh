#!/bin/bash

set -e

NAMESPACE="expense-tracker"

echo "Updating Kubernetes secrets for expense-tracker"
echo ""

read -sp "Enter JWT Secret (min 32 characters): " JWT_SECRET
echo ""

MONGODB_URI=${MONGODB_URI:-"mongodb://mongodb-service:27017/expense-tracker"}

kubectl create secret generic expense-tracker-secrets \
  --from-literal=jwt-secret="$JWT_SECRET" \
  --from-literal=mongodb-uri="$MONGODB_URI" \
  --namespace=$NAMESPACE \
  --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "Secrets updated successfully!"
echo ""
echo "Restarting deployments to pick up new secrets..."

kubectl rollout restart deployment/backend -n $NAMESPACE

echo "Backend deployment restarted. Monitor with:"
echo "kubectl rollout status deployment/backend -n $NAMESPACE"
