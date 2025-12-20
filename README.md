# Expense Tracker

## Database Selection Decision

When starting this project, I had to decide between MongoDB and a relational database for the subscription and expense tracking system.

### Why MongoDB

After evaluating both options, I chose MongoDB for several practical reasons.

**Flexibility in Data Structure**

Expense tracking systems need to handle different types of transactions with varying attributes. A monthly expense might have different fields than a one-time purchase or a recurring subscription. MongoDB allows storing these variations without strict schema constraints. Adding new fields for special categories or metadata does not require database migrations.

**Natural Document Structure**

Expense data fits well in a document model. Each expense record contains user information, transaction details, category data, and historical notes. In MongoDB, this can be stored as a single document with embedded arrays for tags and nested objects for payment details. This reduces the need for joins and improves read performance.

**Scalability Requirements**

Personal finance applications can grow quickly as users add more transactions over time. MongoDB handles horizontal scaling better than traditional relational databases. As the data grows, sharding distributes it across multiple servers without major application changes.

**Development Speed**

Using MongoDB with Node.js creates a JavaScript-based stack. The JSON-like BSON format maps directly to JavaScript objects, which speeds up development. There is no need for ORM layers or complex mapping logic.

**Transaction Support**

MongoDB supports multi-document ACID transactions since version 4.0. For recording expenses and managing user accounts, MongoDB transactions provide sufficient guarantees while maintaining flexibility.

### Alternative: Relational Database

If this project used PostgreSQL or MySQL instead, the approach would be different.

The schema would be normalized with multiple tables: users, expenses, categories, and tags linked through foreign keys. Any structure change would require migration scripts.

An ORM like Sequelize or TypeORM would map database tables to JavaScript objects. Query optimization would require understanding how the ORM generates SQL.

Fetching complete expense reports with category breakdowns would require joins across multiple tables. This could impact performance and would need careful indexing.

Transaction management would be more explicit with BEGIN, COMMIT, and ROLLBACK statements wrapping related operations.

Vertical scaling would be the primary approach initially. Horizontal scaling through read replicas would handle read-heavy workloads, but write scaling would be more challenging.

The core application logic would remain similar, but the data layer would be structured differently. With proper abstraction through a repository pattern, the impact on business logic could be minimized.

## About This Project

This is a full-stack personal expense tracking application built with the MERN stack and TypeScript. It helps users track their daily expenses, categorize spending, and visualize financial patterns over time.

### Features

- User authentication with JWT
- Add, edit, and delete expenses
- Categorize expenses by type
- Monthly summary dashboard with charts
- Category-based spending analytics
- Daily expense tracking
- Responsive design for mobile and desktop

## Tech Stack

### Backend

- Node.js 18
- Express.js
- MongoDB with Mongoose
- TypeScript
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

### Frontend

- React 18
- TypeScript
- Vite build tool
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- date-fns for date formatting

### Infrastructure

- Docker for containerization
- Kubernetes for orchestration
- Nginx for frontend serving and reverse proxy
- GitHub Actions for CI/CD

## Prerequisites

- Node.js 18 or higher
- MongoDB 4.4 or higher
- npm 9 or higher
- Docker (for containerized deployment)
- Kubernetes cluster (for production deployment)

## Installation

### Clone the repository

```bash
git clone git@github.com:indreshiiit/expense-management.git
cd expense-management
```

### Install dependencies

From the project root:

```bash
npm install
```

This will install dependencies for both backend and frontend.

### Set up environment variables

#### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit backend/.env with your settings:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secure-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

#### Frontend Configuration

```bash
cd frontend
cp .env.example .env
```

Edit frontend/.env:

```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

Run both frontend and backend together:

```bash
npm run dev
```

Or run them separately:

Backend only:
```bash
npm run dev:backend
```

Frontend only:
```bash
npm run dev:frontend
```

The backend will run on http://localhost:5000 and the frontend on http://localhost:5173.

### Production Mode

Build the application:

```bash
npm run build
```

Start the backend server:

```bash
npm start
```

The frontend build will be in the frontend/dist directory and can be served with any static file server or Nginx.

## API Endpoints

### Authentication

- POST /api/auth/register - Create a new user account
- POST /api/auth/login - Login and receive JWT token

### Expenses

- GET /api/expenses - Get all expenses for authenticated user
- POST /api/expenses - Create a new expense
- GET /api/expenses/:id - Get a specific expense
- PUT /api/expenses/:id - Update an expense
- DELETE /api/expenses/:id - Delete an expense
- GET /api/expenses/summary - Get monthly summary
- GET /api/expenses/stats - Get spending statistics

All expense endpoints require authentication with JWT token in Authorization header.

## Project Structure

```
expense-management/
├── backend/
│   ├── src/
│   │   ├── config/          
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Application entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     
│   │   ├── context/         
│   │   ├── hooks/           
│   │   ├── pages/           
│   │   ├── services/       
│   │   ├── styles/          
│   │   ├── types/           
│   │   ├── utils/           
│   │   ├── App.tsx          
│   │   └── main.tsx         
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
├── k8s/                     
│   └── base/
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       ├── frontend-service.yaml
│       ├── mongodb-deployment.yaml
│       ├── mongodb-service.yaml
│       ├── mongodb-pvc.yaml
│       ├── secrets.yaml
│       ├── ingress.yaml
│       └── kustomization.yaml
├── .github/
│   └── workflows/
│       └── deploy.yml       
├── docker-compose.yml
└── package.json
```

## GitHub Actions CI/CD

This project uses GitHub Actions for continuous integration and deployment. The pipeline automatically builds Docker images and deploys to Kubernetes when code is pushed to the main branch.

### Pipeline Workflow

The CI/CD process includes these stages:

1. **Build Backend Image** - Builds the Node.js backend application into a Docker image
2. **Build Frontend Image** - Builds the React frontend with Nginx into a Docker image
3. **Push to Registry** - Pushes both images to GitHub Container Registry (ghcr.io)
4. **Deploy to Kubernetes** - Applies Kubernetes manifests to the cluster using kubectl

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

- `KUBECONFIG` - Kubernetes configuration file content (plain text, not base64 encoded)
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions for registry authentication

### Workflow Configuration

The workflow is defined in .github/workflows/deploy.yml and runs on every push to the main branch. It performs the following:

- Checks out the code
- Logs in to GitHub Container Registry
- Builds and tags Docker images with the main tag
- Pushes images to the registry
- Configures kubectl with the provided kubeconfig
- Creates the expense-tracker namespace if it does not exist
- Creates an image pull secret for private registry access
- Applies all Kubernetes manifests using kustomize

### Manual Deployment

You can also trigger the workflow manually from the Actions tab in GitHub.

## Kubernetes Deployment

The application is deployed on a Kubernetes cluster and accessible at https://expense.premiertickets.biz.

### Architecture

The deployment consists of:

- **MongoDB** - Database running as a StatefulSet with persistent storage
- **Backend** - Node.js API server running as a Deployment with 3 replicas
- **Frontend** - React app with Nginx running as a Deployment with 2 replicas
- **Services** - ClusterIP services for internal communication
- **Ingress** - HTTPS ingress for external access
- **Secrets** - Kubernetes secrets for JWT and MongoDB URI
- **PersistentVolumeClaim** - 10Gi storage for MongoDB data

### Storage Configuration

The MongoDB deployment uses a PersistentVolumeClaim with the local-path storage class. This is a local storage provisioner suitable for single-node or development clusters.

```yaml
storageClassName: local-path
storage: 10Gi
```

For production multi-node clusters, consider using a distributed storage solution.


### Health Checks

All deployments include liveness and readiness probes:

- MongoDB uses TCP socket checks on port 27017
- Backend uses HTTP GET requests to /health endpoint
- Frontend uses HTTP GET requests to root path

### Deployment Commands

Apply all Kubernetes manifests:

```bash
kubectl apply -k k8s/base/
```

Check deployment status:

```bash
kubectl get pods -n expense-tracker
kubectl get services -n expense-tracker
kubectl get ingress -n expense-tracker
```

View logs:

```bash
kubectl logs -n expense-tracker -l app=backend --tail=100
kubectl logs -n expense-tracker -l app=frontend --tail=100
kubectl logs -n expense-tracker -l app=mongodb --tail=100
```

Check resource usage:

```bash
kubectl top pods -n expense-tracker
```

Restart a deployment:

```bash
kubectl rollout restart deployment/backend -n expense-tracker
kubectl rollout restart deployment/frontend -n expense-tracker
```

Delete all resources:

```bash
kubectl delete namespace expense-tracker
```

### Troubleshooting

Check pod events if a pod is not starting:

```bash
kubectl describe pod <pod-name> -n expense-tracker
```

Check if PVC is bound:

```bash
kubectl get pvc -n expense-tracker
```

Verify secrets are created:

```bash
kubectl get secrets -n expense-tracker
```

Execute commands inside a pod:

```bash
kubectl exec -it <pod-name> -n expense-tracker -- /bin/sh
```

### Security Considerations

- JWT secret is stored in Kubernetes secrets, not in code
- MongoDB URI is stored in secrets
- Image pull secrets are used for private registry access
- Ingress is configured with TLS termination
- Backend validates all user inputs
- Passwords are hashed with bcrypt before storage


```


