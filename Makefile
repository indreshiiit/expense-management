.PHONY: help build deploy status logs clean rollback update-secrets

NAMESPACE := expense-tracker
DOCKER_REGISTRY ?=
IMAGE_TAG ?= latest

help:
	@echo "Expense Tracker - Kubernetes Deployment"
	@echo ""
	@echo "Available commands:"
	@echo "  make build          - Build Docker images"
	@echo "  make deploy         - Deploy to Kubernetes"
	@echo "  make quick-start    - Interactive quick start deployment"
	@echo "  make status         - Show deployment status"
	@echo "  make logs           - Show application logs"
	@echo "  make update-secrets - Update Kubernetes secrets"
	@echo "  make rollback       - Rollback deployments"
	@echo "  make scale          - Scale deployments"
	@echo "  make clean          - Delete all resources"
	@echo ""
	@echo "Variables:"
	@echo "  DOCKER_REGISTRY - Container registry (default: none)"
	@echo "  IMAGE_TAG       - Image tag (default: latest)"
	@echo ""

build:
	@echo "Building Docker images..."
	@DOCKER_REGISTRY=$(DOCKER_REGISTRY) IMAGE_TAG=$(IMAGE_TAG) ./scripts/build-images.sh

deploy:
	@echo "Deploying to Kubernetes..."
	@./scripts/deploy.sh

quick-start:
	@./scripts/quick-start.sh

status:
	@./scripts/status.sh

logs:
	@echo "Showing logs for all pods..."
	@kubectl logs -f -l 'app in (backend,frontend,mongodb)' -n $(NAMESPACE) --max-log-requests=10

logs-backend:
	@kubectl logs -f -l app=backend -n $(NAMESPACE)

logs-frontend:
	@kubectl logs -f -l app=frontend -n $(NAMESPACE)

logs-mongodb:
	@kubectl logs -f -l app=mongodb -n $(NAMESPACE)

update-secrets:
	@./scripts/update-secrets.sh

rollback:
	@./scripts/rollback.sh all

rollback-backend:
	@./scripts/rollback.sh backend

rollback-frontend:
	@./scripts/rollback.sh frontend

scale:
	@echo "Scaling deployments..."
	@kubectl scale deployment backend --replicas=3 -n $(NAMESPACE)
	@kubectl scale deployment frontend --replicas=3 -n $(NAMESPACE)
	@echo "Waiting for pods to be ready..."
	@kubectl wait --for=condition=available --timeout=300s deployment/backend -n $(NAMESPACE)
	@kubectl wait --for=condition=available --timeout=300s deployment/frontend -n $(NAMESPACE)

scale-down:
	@echo "Scaling down deployments..."
	@kubectl scale deployment backend --replicas=1 -n $(NAMESPACE)
	@kubectl scale deployment frontend --replicas=1 -n $(NAMESPACE)

clean:
	@./scripts/cleanup.sh

restart:
	@echo "Restarting deployments..."
	@kubectl rollout restart deployment/backend -n $(NAMESPACE)
	@kubectl rollout restart deployment/frontend -n $(NAMESPACE)

watch:
	@kubectl get pods -n $(NAMESPACE) -w

shell-backend:
	@kubectl exec -it deployment/backend -n $(NAMESPACE) -- sh

shell-frontend:
	@kubectl exec -it deployment/frontend -n $(NAMESPACE) -- sh

shell-mongodb:
	@kubectl exec -it deployment/mongodb -n $(NAMESPACE) -- mongo expense-tracker

port-forward-backend:
	@kubectl port-forward svc/backend-service 5000:5000 -n $(NAMESPACE)

port-forward-frontend:
	@kubectl port-forward svc/frontend-service 8080:80 -n $(NAMESPACE)

backup-db:
	@echo "Creating MongoDB backup..."
	@kubectl exec deployment/mongodb -n $(NAMESPACE) -- mongodump --archive=/data/backup-$$(date +%Y%m%d-%H%M%S).archive --db=expense-tracker
	@echo "Backup created successfully"

cert-status:
	@kubectl get certificate -n $(NAMESPACE)
	@kubectl describe certificate expense-tracker-tls -n $(NAMESPACE)
