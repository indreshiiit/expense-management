#!/bin/bash

NAMESPACE="expense-tracker"

echo "==============================================="
echo "Expense Tracker - Kubernetes Status"
echo "==============================================="
echo ""

echo "Namespace:"
kubectl get namespace $NAMESPACE
echo ""

echo "Pods:"
kubectl get pods -n $NAMESPACE -o wide
echo ""

echo "Deployments:"
kubectl get deployments -n $NAMESPACE
echo ""

echo "Services:"
kubectl get svc -n $NAMESPACE
echo ""

echo "Ingress:"
kubectl get ingress -n $NAMESPACE
echo ""

echo "PersistentVolumeClaims:"
kubectl get pvc -n $NAMESPACE
echo ""

echo "ConfigMaps:"
kubectl get configmap -n $NAMESPACE
echo ""

echo "Secrets:"
kubectl get secrets -n $NAMESPACE
echo ""

echo "Certificate Status:"
kubectl get certificate -n $NAMESPACE 2>/dev/null || echo "No certificates found (cert-manager might not be installed)"
echo ""

echo "Recent Events:"
kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -20
echo ""

echo "==============================================="
