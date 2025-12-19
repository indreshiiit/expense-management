#!/bin/bash

set -e

NAMESPACE="expense-tracker"
KUBECTL_CONTEXT=${KUBECTL_CONTEXT:-$(kubectl config current-context)}

echo "Deploying to Kubernetes context: $KUBECTL_CONTEXT"
echo "Namespace: $NAMESPACE"

echo "Applying Kubernetes manifests..."
kubectl apply -k k8s/base/

echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s \
    deployment/mongodb \
    deployment/backend \
    deployment/frontend \
    -n $NAMESPACE

echo "Checking pod status..."
kubectl get pods -n $NAMESPACE

echo "Checking services..."
kubectl get svc -n $NAMESPACE

echo "Checking ingress..."
kubectl get ingress -n $NAMESPACE

echo ""
echo "Deployment complete!"
echo ""
echo "Access your application at: https://expense.premiertickets.biz"
echo ""
echo "To view logs:"
echo "  Backend:  kubectl logs -f -l app=backend -n $NAMESPACE"
echo "  Frontend: kubectl logs -f -l app=frontend -n $NAMESPACE"
echo "  MongoDB:  kubectl logs -f -l app=mongodb -n $NAMESPACE"
