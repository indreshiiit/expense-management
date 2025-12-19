# Expense Tracker

A full-stack personal expense tracking application built with the MERN stack and TypeScript.

## Features

- User authentication with JWT
- Add, edit, and delete expenses
- Categorize expenses
- Monthly summary dashboard with visualizations
- Category-based spending analytics
- Daily expense tracking
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- TypeScript
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Recharts for data visualization
- Axios for API calls
- date-fns for date formatting

## Prerequisites

- Node.js 18+
- MongoDB 4.4+
- npm 9+

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit backend/.env:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secure-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```bash
cd ../frontend
cp .env.example .env
```

Edit frontend/.env:
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

Run both frontend and backend:
```bash
npm run dev
```

Or run separately:

Backend:
```bash
npm run dev:backend
```

Frontend:
```bash
npm run dev:frontend
```

### Production Mode

Build the application:
```bash
npm run build
```

Start the backend:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Expenses
- GET /api/expenses - Get all expenses
- POST /api/expenses - Create expense
- GET /api/expenses/:id - Get single expense
- PUT /api/expenses/:id - Update expense
- DELETE /api/expenses/:id - Delete expense
- GET /api/expenses/summary - Get monthly summary
- GET /api/expenses/stats - Get category statistics

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
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
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
└── package.json
```

## Deployment

### Docker Deployment

Using Docker Compose:

```bash
docker-compose up -d
```

Access the application at http://localhost:3000

### Kubernetes Deployment

Deploy to Kubernetes cluster with domain expense.premiertickets.biz:

```bash
make quick-start
```

Or manually:

```bash
./scripts/build-images.sh
./scripts/update-secrets.sh
./scripts/deploy.sh
```

For detailed Kubernetes deployment instructions, see [KUBERNETES_DEPLOYMENT.md](KUBERNETES_DEPLOYMENT.md).

#### Available Make Commands

- `make build` - Build Docker images
- `make deploy` - Deploy to Kubernetes
- `make status` - Check deployment status
- `make logs` - View application logs
- `make rollback` - Rollback deployments
- `make clean` - Delete all resources

### Production Checklist

Before deploying to production:

1. Update JWT_SECRET in secrets
2. Configure DNS to point to your ingress IP
3. Verify cert-manager is installed for SSL
4. Review resource limits in deployment files
5. Set up monitoring and alerting
6. Configure backup strategy for MongoDB
7. Enable RBAC and network policies

## License

MIT
