#!/bin/bash

set -e

NAMESPACE="expense-tracker"

echo "WARNING: This will delete all resources in the $NAMESPACE namespace!"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo "Deleting all resources..."
kubectl delete -k k8s/base/ || true

echo "Waiting for namespace to be fully deleted..."
kubectl wait --for=delete namespace/$NAMESPACE --timeout=120s || true

echo "Cleanup complete!"
