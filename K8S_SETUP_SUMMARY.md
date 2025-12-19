# Kubernetes Setup Summary

Complete Kubernetes deployment configuration for Expense Tracker on **expense.premiertickets.biz**

## What Was Created

### Kubernetes Manifests (k8s/base/)

1. **namespace.yaml** - Dedicated namespace for the application
2. **secrets.yaml** - Sensitive configuration (JWT secret, MongoDB URI)
3. **configmap.yaml** - Application configuration
4. **nginx-configmap.yaml** - Nginx configuration for frontend
5. **mongodb-pvc.yaml** - Persistent volume claim for MongoDB
6. **mongodb-deployment.yaml** - MongoDB database deployment
7. **mongodb-service.yaml** - MongoDB service
8. **backend-deployment.yaml** - Backend API deployment
9. **backend-service.yaml** - Backend service
10. **frontend-deployment.yaml** - Frontend React app deployment
11. **frontend-service.yaml** - Frontend service
12. **ingress.yaml** - Ingress with SSL for expense.premiertickets.biz
13. **cert-issuer.yaml** - Let's Encrypt certificate issuer
14. **kustomization.yaml** - Kustomize configuration

### Deployment Scripts (scripts/)

1. **build-images.sh** - Build Docker images and push to registry
2. **deploy.sh** - Deploy all Kubernetes resources
3. **quick-start.sh** - Interactive deployment wizard
4. **update-secrets.sh** - Update Kubernetes secrets
5. **rollback.sh** - Rollback deployments
6. **status.sh** - Check deployment status
7. **cleanup.sh** - Remove all resources

### Documentation

1. **KUBERNETES_DEPLOYMENT.md** - Comprehensive deployment guide
2. **DEPLOYMENT_CHECKLIST.md** - Production deployment checklist
3. **K8S_SETUP_SUMMARY.md** - This file

### CI/CD

1. **.github/workflows/deploy.yml** - GitHub Actions workflow

### Build Configuration

1. **Makefile** - Convenient make commands for deployment
2. **Dockerfile** (backend) - Multi-stage backend build
3. **Dockerfile** (frontend) - Multi-stage frontend build with Nginx

## Quick Deployment Guide

### Prerequisites

1. Install required tools:
   - kubectl
   - docker
   - make (optional)

2. Ensure cluster has:
   - NGINX Ingress Controller
   - cert-manager
   - StorageClass for PVCs

3. Configure DNS:
   - Point expense.premiertickets.biz to your ingress IP

### Deployment Steps

#### Option 1: Quick Start (Recommended)

```bash
./scripts/quick-start.sh
```

Follow the interactive prompts.

#### Option 2: Manual Deployment

```bash
./scripts/build-images.sh
./scripts/update-secrets.sh
./scripts/deploy.sh
```

#### Option 3: Using Makefile

```bash
make build
make update-secrets
make deploy
```

## Architecture

### Application Stack

```
┌─────────────────────────────────────────┐
│         expense.premiertickets.biz      │
│              (HTTPS/SSL)                 │
└──────────────────┬──────────────────────┘
                   │
          ┌────────▼────────┐
          │  Ingress (NGINX)│
          └────────┬────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼──────┐       ┌───────▼────────┐
│  Frontend   │       │    Backend     │
│  Service    │       │    Service     │
│  (Port 80)  │       │   (Port 5000)  │
└──────┬──────┘       └───────┬────────┘
       │                      │
┌──────▼──────┐       ┌───────▼────────┐
│  Frontend   │       │    Backend     │
│ Deployment  │       │   Deployment   │
│  (2 pods)   │       │    (2 pods)    │
└─────────────┘       └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │    MongoDB     │
                      │    Service     │
                      │  (Port 27017)  │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │    MongoDB     │
                      │   Deployment   │
                      │    (1 pod)     │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │  Persistent    │
                      │    Volume      │
                      │    (10Gi)      │
                      └────────────────┘
```

### Resource Allocation

**Total Resources Required:**
- CPU: ~1.1 cores minimum
- Memory: ~2GB minimum
- Storage: 10GB for database

**MongoDB:**
- 1 pod
- 512Mi-1Gi RAM
- 250m-500m CPU
- 10Gi persistent storage

**Backend:**
- 2 pods
- 256Mi-512Mi RAM per pod
- 200m-500m CPU per pod

**Frontend:**
- 2 pods
- 128Mi-256Mi RAM per pod
- 100m-200m CPU per pod

## Configuration Files

### Critical Files to Update

1. **k8s/base/secrets.yaml**
   - JWT_SECRET (production secret)
   - MONGODB_URI (if using external DB)

2. **k8s/base/configmap.yaml**
   - CORS_ORIGIN (your domain)
   - NODE_ENV (production)

3. **k8s/base/ingress.yaml**
   - host (your domain)
   - tls hosts

4. **k8s/base/cert-issuer.yaml**
   - email (for Let's Encrypt)

### Deployment Configuration

Backend: 2 replicas with health checks
Frontend: 2 replicas with health checks
MongoDB: 1 replica with liveness/readiness probes

## SSL/TLS Configuration

Automatic SSL using cert-manager and Let's Encrypt:

1. ClusterIssuer configured for Let's Encrypt production
2. Certificate auto-generated for expense.premiertickets.biz
3. Ingress configured with TLS termination
4. HTTP to HTTPS redirect enabled

## Available Commands

### Makefile Commands

```bash
make build              # Build Docker images
make deploy             # Deploy to Kubernetes
make quick-start        # Interactive deployment
make status             # Show deployment status
make logs               # View all logs
make logs-backend       # View backend logs
make logs-frontend      # View frontend logs
make logs-mongodb       # View MongoDB logs
make update-secrets     # Update secrets
make rollback           # Rollback all deployments
make rollback-backend   # Rollback backend only
make rollback-frontend  # Rollback frontend only
make scale              # Scale to 3 replicas
make scale-down         # Scale to 1 replica
make restart            # Restart deployments
make watch              # Watch pod status
make clean              # Delete all resources
make backup-db          # Backup MongoDB
make cert-status        # Check SSL certificate status
```

### Direct kubectl Commands

```bash
kubectl get all -n expense-tracker
kubectl get pods -n expense-tracker -w
kubectl logs -f deployment/backend -n expense-tracker
kubectl describe ingress expense-tracker-ingress -n expense-tracker
kubectl get certificate -n expense-tracker
```

## Monitoring and Debugging

### Check Application Status

```bash
./scripts/status.sh
```

### View Logs

```bash
kubectl logs -f -l app=backend -n expense-tracker
kubectl logs -f -l app=frontend -n expense-tracker
kubectl logs -f -l app=mongodb -n expense-tracker
```

### Access Pods

```bash
kubectl exec -it deployment/backend -n expense-tracker -- sh
kubectl exec -it deployment/mongodb -n expense-tracker -- mongo
```

### Port Forward for Local Testing

```bash
kubectl port-forward svc/backend-service 5000:5000 -n expense-tracker
kubectl port-forward svc/frontend-service 8080:80 -n expense-tracker
```

## Scaling

### Manual Scaling

```bash
kubectl scale deployment backend --replicas=5 -n expense-tracker
kubectl scale deployment frontend --replicas=5 -n expense-tracker
```

### Auto-scaling

```bash
kubectl autoscale deployment backend \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n expense-tracker
```

## Backup and Restore

### Backup MongoDB

```bash
kubectl exec deployment/mongodb -n expense-tracker -- \
  mongodump --archive=/data/backup.archive --db=expense-tracker

kubectl cp expense-tracker/$(kubectl get pod -l app=mongodb -n expense-tracker -o jsonpath='{.items[0].metadata.name}'):/data/backup.archive ./backup.archive
```

### Restore MongoDB

```bash
kubectl cp ./backup.archive expense-tracker/$(kubectl get pod -l app=mongodb -n expense-tracker -o jsonpath='{.items[0].metadata.name}'):/data/backup.archive

kubectl exec deployment/mongodb -n expense-tracker -- \
  mongorestore --archive=/data/backup.archive
```

## Updates and Rollbacks

### Update Application

```bash
export IMAGE_TAG=v1.1.0
./scripts/build-images.sh

kubectl set image deployment/backend \
  backend=expense-tracker-backend:v1.1.0 \
  -n expense-tracker

kubectl rollout status deployment/backend -n expense-tracker
```

### Rollback

```bash
./scripts/rollback.sh backend
./scripts/rollback.sh frontend
./scripts/rollback.sh all
```

## Troubleshooting

### Pods CrashLooping

```bash
kubectl describe pod POD_NAME -n expense-tracker
kubectl logs POD_NAME -n expense-tracker --previous
```

### Ingress Not Working

1. Check ingress controller is running
2. Verify DNS points to ingress IP
3. Check certificate is issued
4. Review ingress annotations

### Database Connection Errors

1. Verify MongoDB pod is running
2. Check MongoDB service exists
3. Test connection from backend pod
4. Verify MongoDB URI in secrets

### SSL Certificate Not Issued

```bash
kubectl describe certificate expense-tracker-tls -n expense-tracker
kubectl get challenges -n expense-tracker
kubectl logs -n cert-manager deployment/cert-manager
```

## Security Best Practices

1. Use strong JWT secret (32+ characters)
2. Enable RBAC in cluster
3. Use network policies
4. Scan images for vulnerabilities
5. Use private container registry
6. Rotate secrets regularly
7. Enable audit logging
8. Use pod security policies

## Production Readiness

Before going to production:

- [ ] DNS configured correctly
- [ ] SSL certificate issued and valid
- [ ] Strong secrets configured
- [ ] Resource limits set appropriately
- [ ] Health checks working
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented
- [ ] Load testing completed
- [ ] Security scan passed

## Next Steps

1. Configure monitoring (Prometheus/Grafana)
2. Set up log aggregation (ELK/Loki)
3. Implement CI/CD pipeline
4. Configure auto-scaling
5. Set up database backups
6. Enable network policies
7. Configure RBAC
8. Set up alerts

## Support and Documentation

- Main README: [README.md](README.md)
- Deployment Guide: [KUBERNETES_DEPLOYMENT.md](KUBERNETES_DEPLOYMENT.md)
- Deployment Checklist: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## Files and Directories

```
k8s/
├── base/                     # Base Kubernetes manifests
│   ├── namespace.yaml
│   ├── secrets.yaml
│   ├── configmap.yaml
│   ├── nginx-configmap.yaml
│   ├── mongodb-pvc.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml
│   ├── cert-issuer.yaml
│   └── kustomization.yaml
└── overlays/                 # Environment-specific overlays
    ├── dev/
    └── prod/

scripts/
├── build-images.sh           # Build Docker images
├── deploy.sh                 # Deploy to Kubernetes
├── quick-start.sh            # Interactive deployment
├── update-secrets.sh         # Update secrets
├── rollback.sh               # Rollback deployments
├── status.sh                 # Check status
└── cleanup.sh                # Remove resources
```

## Success Criteria

Deployment is successful when:

1. All pods are running and ready
2. Services are accessible
3. Ingress has external IP
4. SSL certificate is valid
5. Application accessible at https://expense.premiertickets.biz
6. Users can register and login
7. Expenses can be created/edited/deleted
8. Dashboard displays correctly
9. No errors in logs
10. Health checks passing

Access your application: **https://expense.premiertickets.biz**
