# Kubernetes Deployment Guide

This guide covers deploying the Expense Tracker application to Kubernetes with the domain **expense.premiertickets.biz**.

## Prerequisites

### Required Tools
- kubectl (v1.24+)
- Docker (v20.10+)
- Access to a Kubernetes cluster
- Domain DNS configured to point to your cluster ingress IP

### Required Cluster Components
- NGINX Ingress Controller
- cert-manager (for automatic SSL certificates)
- StorageClass for persistent volumes

## Quick Start

### 1. Verify Prerequisites

Check that required components are installed:

```bash
kubectl get pods -n ingress-nginx
kubectl get pods -n cert-manager
```

### 2. Update Secrets

Before deploying, update the JWT secret:

```bash
./scripts/update-secrets.sh
```

You will be prompted to enter a secure JWT secret (minimum 32 characters).

### 3. Build Docker Images

Build and optionally push images to your registry:

```bash
export DOCKER_REGISTRY=your-registry.io
export IMAGE_TAG=v1.0.0
./scripts/build-images.sh
```

For local development without a registry:

```bash
./scripts/build-images.sh
```

### 4. Update Image References

If using a container registry, update the image references in:
- [k8s/base/backend-deployment.yaml](k8s/base/backend-deployment.yaml)
- [k8s/base/frontend-deployment.yaml](k8s/base/frontend-deployment.yaml)

Change:
```yaml
image: expense-tracker-backend:latest
```

To:
```yaml
image: your-registry.io/expense-tracker-backend:v1.0.0
```

### 5. Deploy to Kubernetes

Deploy all resources:

```bash
./scripts/deploy.sh
```

This will:
- Create the expense-tracker namespace
- Deploy MongoDB with persistent storage
- Deploy the backend API
- Deploy the frontend
- Create ingress with SSL

### 6. Verify Deployment

Check the status:

```bash
./scripts/status.sh
```

Monitor pod startup:

```bash
kubectl get pods -n expense-tracker -w
```

## Configuration

### Environment Variables

Edit [k8s/base/configmap.yaml](k8s/base/configmap.yaml) to change:
- NODE_ENV
- PORT
- JWT_EXPIRE
- CORS_ORIGIN

### Secrets Management

Secrets are stored in [k8s/base/secrets.yaml](k8s/base/secrets.yaml).

Update secrets:
```bash
./scripts/update-secrets.sh
```

Or manually:
```bash
kubectl create secret generic expense-tracker-secrets \
  --from-literal=jwt-secret="YOUR_SECRET_HERE" \
  --from-literal=mongodb-uri="mongodb://mongodb-service:27017/expense-tracker" \
  --namespace=expense-tracker \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Domain Configuration

The application is configured for **expense.premiertickets.biz**.

To change the domain:

1. Update [k8s/base/ingress.yaml](k8s/base/ingress.yaml):
```yaml
spec:
  tls:
  - hosts:
    - your-domain.com
  rules:
  - host: your-domain.com
```

2. Update [k8s/base/configmap.yaml](k8s/base/configmap.yaml):
```yaml
data:
  CORS_ORIGIN: "https://your-domain.com"
```

3. Update [k8s/base/nginx-configmap.yaml](k8s/base/nginx-configmap.yaml):
```nginx
server_name your-domain.com;
```

4. Update [k8s/base/cert-issuer.yaml](k8s/base/cert-issuer.yaml):
```yaml
email: admin@your-domain.com
```

### SSL Certificates

The deployment uses cert-manager with Let's Encrypt for automatic SSL certificates.

Check certificate status:
```bash
kubectl get certificate -n expense-tracker
kubectl describe certificate expense-tracker-tls -n expense-tracker
```

If cert-manager is not installed:
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

### Storage

MongoDB uses a PersistentVolumeClaim requesting 10Gi of storage.

Modify storage size in [k8s/base/mongodb-pvc.yaml](k8s/base/mongodb-pvc.yaml):
```yaml
resources:
  requests:
    storage: 20Gi
```

## DNS Configuration

Point your domain to the Kubernetes ingress:

1. Get the ingress IP:
```bash
kubectl get ingress -n expense-tracker
```

2. Create an A record:
```
expense.premiertickets.biz  A  YOUR_INGRESS_IP
```

Or use CNAME if using a cloud load balancer:
```
expense.premiertickets.biz  CNAME  your-lb.cloud-provider.com
```

## Scaling

Scale deployments:

```bash
kubectl scale deployment backend --replicas=3 -n expense-tracker
kubectl scale deployment frontend --replicas=3 -n expense-tracker
```

Enable horizontal pod autoscaling:

```bash
kubectl autoscale deployment backend \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n expense-tracker
```

## Monitoring

### View Logs

Backend logs:
```bash
kubectl logs -f -l app=backend -n expense-tracker
```

Frontend logs:
```bash
kubectl logs -f -l app=frontend -n expense-tracker
```

MongoDB logs:
```bash
kubectl logs -f -l app=mongodb -n expense-tracker
```

All logs:
```bash
kubectl logs -f -l 'app in (backend,frontend,mongodb)' -n expense-tracker
```

### Port Forwarding

Access services locally:

```bash
kubectl port-forward svc/backend-service 5000:5000 -n expense-tracker
kubectl port-forward svc/frontend-service 8080:80 -n expense-tracker
kubectl port-forward svc/mongodb-service 27017:27017 -n expense-tracker
```

### Execute Commands

Access MongoDB shell:
```bash
kubectl exec -it deployment/mongodb -n expense-tracker -- mongo expense-tracker
```

Access backend container:
```bash
kubectl exec -it deployment/backend -n expense-tracker -- sh
```

## Backup and Restore

### Backup MongoDB

Create a backup:
```bash
kubectl exec deployment/mongodb -n expense-tracker -- \
  mongodump --archive=/data/backup.archive --db=expense-tracker

kubectl cp expense-tracker/mongodb-pod-name:/data/backup.archive ./backup.archive
```

### Restore MongoDB

Restore from backup:
```bash
kubectl cp ./backup.archive expense-tracker/mongodb-pod-name:/data/backup.archive

kubectl exec deployment/mongodb -n expense-tracker -- \
  mongorestore --archive=/data/backup.archive
```

## Updating the Application

### Update Backend

1. Build new image:
```bash
export IMAGE_TAG=v1.1.0
./scripts/build-images.sh
```

2. Update deployment:
```bash
kubectl set image deployment/backend \
  backend=expense-tracker-backend:v1.1.0 \
  -n expense-tracker
```

3. Monitor rollout:
```bash
kubectl rollout status deployment/backend -n expense-tracker
```

### Update Frontend

Same process as backend:
```bash
kubectl set image deployment/frontend \
  frontend=expense-tracker-frontend:v1.1.0 \
  -n expense-tracker
```

### Rollback

Rollback a deployment:
```bash
./scripts/rollback.sh backend
./scripts/rollback.sh frontend
./scripts/rollback.sh all
```

Or manually:
```bash
kubectl rollout undo deployment/backend -n expense-tracker
```

## Troubleshooting

### Pods Not Starting

Check pod status:
```bash
kubectl describe pod POD_NAME -n expense-tracker
```

Check logs:
```bash
kubectl logs POD_NAME -n expense-tracker
```

### Database Connection Issues

Verify MongoDB is running:
```bash
kubectl get pods -l app=mongodb -n expense-tracker
```

Test connection from backend:
```bash
kubectl exec -it deployment/backend -n expense-tracker -- \
  curl mongodb-service:27017
```

### Ingress Not Working

Check ingress controller:
```bash
kubectl get pods -n ingress-nginx
```

Check ingress configuration:
```bash
kubectl describe ingress expense-tracker-ingress -n expense-tracker
```

Verify DNS:
```bash
nslookup expense.premiertickets.biz
```

### SSL Certificate Issues

Check certificate:
```bash
kubectl describe certificate expense-tracker-tls -n expense-tracker
```

Check cert-manager logs:
```bash
kubectl logs -n cert-manager -l app=cert-manager
```

Force certificate renewal:
```bash
kubectl delete certificate expense-tracker-tls -n expense-tracker
kubectl apply -k k8s/base/
```

## Resource Requirements

### Minimum Cluster Requirements

- 3 worker nodes
- 4GB RAM per node
- 2 vCPUs per node
- 50GB disk space

### Per-Pod Resources

**MongoDB:**
- Requests: 512Mi RAM, 250m CPU
- Limits: 1Gi RAM, 500m CPU

**Backend:**
- Requests: 256Mi RAM, 200m CPU
- Limits: 512Mi RAM, 500m CPU

**Frontend:**
- Requests: 128Mi RAM, 100m CPU
- Limits: 256Mi RAM, 200m CPU

## Security Considerations

1. Update JWT secret in production
2. Use strong MongoDB credentials
3. Enable network policies
4. Regularly update container images
5. Use private container registry
6. Enable RBAC
7. Scan images for vulnerabilities

## Cleanup

To completely remove the application:

```bash
./scripts/cleanup.sh
```

Or manually:
```bash
kubectl delete namespace expense-tracker
```

## Support

For issues or questions, check:
- Pod logs
- Ingress configuration
- DNS settings
- Certificate status

Run status check:
```bash
./scripts/status.sh
```
