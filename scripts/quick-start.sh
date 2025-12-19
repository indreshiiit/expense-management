#!/bin/bash

set -e

echo "=========================================="
echo "Expense Tracker - Kubernetes Quick Start"
echo "=========================================="
echo ""

echo "This script will guide you through deploying the Expense Tracker application."
echo ""

echo "Step 1: Checking prerequisites..."
echo ""

if ! command -v kubectl &> /dev/null; then
    echo "ERROR: kubectl is not installed. Please install kubectl first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "ERROR: docker is not installed. Please install docker first."
    exit 1
fi

echo "kubectl: $(kubectl version --client --short 2>/dev/null || kubectl version --client)"
echo "docker: $(docker --version)"
echo ""

echo "Step 2: Checking Kubernetes cluster access..."
echo ""
if ! kubectl cluster-info &> /dev/null; then
    echo "ERROR: Cannot connect to Kubernetes cluster."
    echo "Please configure kubectl to connect to your cluster."
    exit 1
fi

kubectl cluster-info
echo ""

echo "Step 3: Checking for required cluster components..."
echo ""

if ! kubectl get namespace ingress-nginx &> /dev/null; then
    echo "WARNING: NGINX Ingress Controller not found."
    echo "You may need to install it. See: https://kubernetes.github.io/ingress-nginx/deploy/"
    read -p "Continue anyway? (yes/no): " CONTINUE
    if [ "$CONTINUE" != "yes" ]; then
        exit 1
    fi
fi

if ! kubectl get namespace cert-manager &> /dev/null; then
    echo "WARNING: cert-manager not found."
    echo "SSL certificates will not work without cert-manager."
    read -p "Install cert-manager now? (yes/no): " INSTALL_CERT_MANAGER
    if [ "$INSTALL_CERT_MANAGER" == "yes" ]; then
        echo "Installing cert-manager..."
        kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
        echo "Waiting for cert-manager to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/cert-manager -n cert-manager
        kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-webhook -n cert-manager
    fi
fi
echo ""

echo "Step 4: Building Docker images..."
echo ""
read -p "Do you want to use a container registry? (yes/no): " USE_REGISTRY

if [ "$USE_REGISTRY" == "yes" ]; then
    read -p "Enter your container registry (e.g., docker.io/username): " DOCKER_REGISTRY
    read -p "Enter image tag (default: latest): " IMAGE_TAG
    IMAGE_TAG=${IMAGE_TAG:-latest}
    export DOCKER_REGISTRY
    export IMAGE_TAG
    ./scripts/build-images.sh

    echo ""
    echo "Please update the image references in:"
    echo "  - k8s/base/backend-deployment.yaml"
    echo "  - k8s/base/frontend-deployment.yaml"
    echo ""
    read -p "Press Enter when ready to continue..."
else
    ./scripts/build-images.sh
fi
echo ""

echo "Step 5: Configuring secrets..."
echo ""
./scripts/update-secrets.sh
echo ""

echo "Step 6: Deploying to Kubernetes..."
echo ""
./scripts/deploy.sh
echo ""

echo "Step 7: Checking DNS configuration..."
echo ""
echo "Make sure your DNS is configured:"
echo "  expense.premiertickets.biz -> [Your Ingress IP]"
echo ""

INGRESS_IP=$(kubectl get ingress expense-tracker-ingress -n expense-tracker -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")
if [ "$INGRESS_IP" == "pending" ] || [ -z "$INGRESS_IP" ]; then
    INGRESS_IP=$(kubectl get ingress expense-tracker-ingress -n expense-tracker -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")
fi

echo "Your Ingress IP/Hostname: $INGRESS_IP"
echo ""

if [ "$INGRESS_IP" != "pending" ]; then
    echo "Create an A record (or CNAME):"
    echo "  expense.premiertickets.biz -> $INGRESS_IP"
else
    echo "Ingress IP is still pending. Run this command later to get it:"
    echo "  kubectl get ingress -n expense-tracker"
fi
echo ""

echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Access your application at: https://expense.premiertickets.biz"
echo ""
echo "Useful commands:"
echo "  Status:   ./scripts/status.sh"
echo "  Logs:     kubectl logs -f -l app=backend -n expense-tracker"
echo "  Rollback: ./scripts/rollback.sh"
echo "  Cleanup:  ./scripts/cleanup.sh"
echo ""
