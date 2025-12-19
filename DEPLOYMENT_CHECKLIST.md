# Deployment Checklist for expense.premiertickets.biz

Use this checklist to ensure a successful production deployment.

## Pre-Deployment

### Infrastructure Setup

- [ ] Kubernetes cluster is running and accessible
- [ ] kubectl is configured with proper credentials
- [ ] NGINX Ingress Controller is installed
- [ ] cert-manager is installed for SSL certificates
- [ ] Sufficient cluster resources available (see requirements below)

### DNS Configuration

- [ ] Domain expense.premiertickets.biz is registered
- [ ] DNS A record points to cluster ingress IP
- [ ] DNS propagation verified

### Container Registry

- [ ] Container registry access configured
- [ ] Docker images can be pushed to registry
- [ ] Cluster has pull access to registry

### Security

- [ ] Strong JWT secret generated (32+ characters)
- [ ] Secrets file updated with production values
- [ ] MongoDB credentials secured
- [ ] SSL certificate email configured

## Deployment Steps

### 1. Build Images

- [ ] Run `./scripts/build-images.sh`
- [ ] Verify images are built successfully
- [ ] Push images to registry if using one

### 2. Configure Kubernetes

- [ ] Update image references in deployment files
- [ ] Review resource limits in deployments
- [ ] Update domain in ingress.yaml
- [ ] Update CORS_ORIGIN in configmap.yaml
- [ ] Update email in cert-issuer.yaml

### 3. Update Secrets

- [ ] Run `./scripts/update-secrets.sh`
- [ ] Enter strong JWT secret
- [ ] Verify MongoDB URI is correct

### 4. Deploy Application

- [ ] Run `./scripts/deploy.sh` or `make deploy`
- [ ] Wait for all pods to be ready
- [ ] Check pod status: `kubectl get pods -n expense-tracker`

### 5. Verify Deployment

- [ ] All pods are running
- [ ] Services are created
- [ ] Ingress has an IP address assigned
- [ ] Certificate is issued successfully

## Post-Deployment

### Verify Application

- [ ] Access https://expense.premiertickets.biz
- [ ] SSL certificate is valid
- [ ] Create a test user account
- [ ] Log in successfully
- [ ] Create a test expense
- [ ] View dashboard with charts
- [ ] Edit and delete test expense
- [ ] Log out

### Health Checks

- [ ] Backend health endpoint: https://expense.premiertickets.biz/api/health
- [ ] Frontend loads correctly
- [ ] No console errors in browser
- [ ] API calls work properly

### Performance

- [ ] Page load time is acceptable
- [ ] API response times are good
- [ ] Charts render properly
- [ ] No memory leaks in pods

### Monitoring

- [ ] Check backend logs: `kubectl logs -l app=backend -n expense-tracker`
- [ ] Check frontend logs: `kubectl logs -l app=frontend -n expense-tracker`
- [ ] Check MongoDB logs: `kubectl logs -l app=mongodb -n expense-tracker`
- [ ] No error messages in logs

### Security

- [ ] HTTPS is enforced
- [ ] HTTP redirects to HTTPS
- [ ] CORS is properly configured
- [ ] Rate limiting is working
- [ ] JWT authentication works

## Backup and Recovery

### Database Backup

- [ ] MongoDB backup tested
- [ ] Backup schedule configured
- [ ] Restore procedure documented
- [ ] Backup storage configured

### Disaster Recovery

- [ ] Rollback procedure tested
- [ ] Previous deployment can be restored
- [ ] Data backup is accessible
- [ ] Recovery time objective (RTO) defined

## Scaling

### Horizontal Scaling

- [ ] Backend pods can scale
- [ ] Frontend pods can scale
- [ ] Load balancing works properly
- [ ] Session persistence tested

### Resource Management

- [ ] CPU usage is within limits
- [ ] Memory usage is within limits
- [ ] Disk usage is monitored
- [ ] Auto-scaling configured if needed

## Documentation

- [ ] README.md is up to date
- [ ] KUBERNETES_DEPLOYMENT.md is accurate
- [ ] API documentation is current
- [ ] Runbooks created for common issues

## Compliance

- [ ] Security policies reviewed
- [ ] Data privacy requirements met
- [ ] Audit logging enabled
- [ ] Access controls configured

## Resource Requirements

### Minimum Cluster Resources

- 3 worker nodes
- 4GB RAM per node
- 2 vCPUs per node
- 50GB disk space
- StorageClass for persistent volumes

### Per-Application Resources

MongoDB:
- Requests: 512Mi RAM, 250m CPU
- Limits: 1Gi RAM, 500m CPU
- Storage: 10Gi PVC

Backend:
- Requests: 256Mi RAM, 200m CPU
- Limits: 512Mi RAM, 500m CPU
- Replicas: 2

Frontend:
- Requests: 128Mi RAM, 100m CPU
- Limits: 256Mi RAM, 200m CPU
- Replicas: 2

## Troubleshooting Reference

### Common Issues

Pods not starting:
```bash
kubectl describe pod POD_NAME -n expense-tracker
kubectl logs POD_NAME -n expense-tracker
```

Ingress not working:
```bash
kubectl get ingress -n expense-tracker
kubectl describe ingress expense-tracker-ingress -n expense-tracker
```

Certificate issues:
```bash
kubectl get certificate -n expense-tracker
kubectl describe certificate expense-tracker-tls -n expense-tracker
```

Database connection:
```bash
kubectl exec -it deployment/backend -n expense-tracker -- curl mongodb-service:27017
```

## Monitoring Commands

Quick status check:
```bash
./scripts/status.sh
```

Watch pods:
```bash
kubectl get pods -n expense-tracker -w
```

View all logs:
```bash
kubectl logs -f -l 'app in (backend,frontend,mongodb)' -n expense-tracker
```

Check resource usage:
```bash
kubectl top pods -n expense-tracker
kubectl top nodes
```

## Emergency Contacts

- DevOps Team: [contact info]
- Database Admin: [contact info]
- Security Team: [contact info]
- On-Call Engineer: [contact info]

## Sign-Off

- [ ] Technical Lead approval
- [ ] Security team approval
- [ ] Operations team approval
- [ ] Product owner approval

Deployment Date: _______________
Deployed By: _______________
Verified By: _______________

## Notes

Additional deployment notes:

