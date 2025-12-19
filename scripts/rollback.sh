#!/bin/bash

set -e

NAMESPACE="expense-tracker"
DEPLOYMENT=${1:-"all"}

rollback_deployment() {
    local dep=$1
    echo "Rolling back $dep..."
    kubectl rollout undo deployment/$dep -n $NAMESPACE
    kubectl rollout status deployment/$dep -n $NAMESPACE
}

if [ "$DEPLOYMENT" == "all" ]; then
    echo "Rolling back all deployments..."
    rollback_deployment "backend"
    rollback_deployment "frontend"
elif [ "$DEPLOYMENT" == "backend" ] || [ "$DEPLOYMENT" == "frontend" ]; then
    rollback_deployment "$DEPLOYMENT"
else
    echo "Usage: $0 [all|backend|frontend]"
    exit 1
fi

echo "Rollback complete!"
