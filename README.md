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
git clone git@github.com:indreshiiit/expense-management.git
cd expense-management
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
MONGODB_URI=mongodb://localhost:27017/expense-management
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
- POST /api/auth/register 
- POST /api/auth/login 

### Expenses
- GET /api/expenses 
- POST /api/expenses 
- GET /api/expenses/:id 
- PUT /api/expenses/:id 
- DELETE /api/expenses/:id 
- GET /api/expenses/summary 
- GET /api/expenses/stats 

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

Access the application at https://expense.premiertickets.biz/

### Kubernetes Deployment

Deployed on Kubernetes cluster with domain expense.premiertickets.biz:


#### Available Make Commands

- `make build` - Build Docker images
- `make deploy` - Deploy to Kubernetes
- `make status` - Check deployment status
- `make logs` - View application logs
- `make rollback` - Rollback deployments
- `make clean` - Delete all resources



