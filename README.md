# Picset AI Clone

AI-powered e-commerce product image generation platform built with Next.js 15 and FastAPI.

## Features

- **Studio Genesis (组图生成)**: Generate multiple professional e-commerce images from a single product photo
- **Aesthetic Mirror (风格复刻)**: Clone the visual style from reference images
- **Refinement Studio (图片精修)**: Fine-tune images with adjustments, filters, and export options

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Zustand 5 (state management)
- React Query (server state)
- shadcn/ui components
- Framer Motion (animations)

### Backend
- FastAPI (Python)
- PostgreSQL (database)
- Redis (caching)
- SQLAlchemy (ORM)
- JWT authentication
- WebSocket (real-time updates)

### AI Services
- Gemini-3-pro (via 云雾 API) - Product analysis & copywriting
- Nano Banana Pro (via 云雾 API) - Image generation

## Project Structure

```
picset-ai-clone/
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── stores/       # Zustand stores
│   │   └── lib/          # Utilities
│   └── package.json
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Config, security, database
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── requirements.txt
└── docker-compose.yml
```

## Setup Instructions

### Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL 16+
- Redis 7+

### Option 1: Docker Setup (Recommended)

1. Clone the repository
```bash
cd picset-ai-clone
```

2. Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and add your YUNWU_API_KEY

# Frontend
cp frontend/.env.local.example frontend/.env.local
```

3. Run with Docker Compose
```bash
docker-compose up --build
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/v1/docs

### Option 2: Manual Setup

#### Frontend

1. Install dependencies
```bash
cd frontend
npm install
```

2. Create `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run development server
```bash
npm run dev
```

Frontend will be available at http://localhost:3000

#### Backend

1. Create virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Create `.env` file
```bash
cp .env.example .env
# Edit .env and configure:
# - DATABASE_URL
# - REDIS_URL
# - SECRET_KEY
# - YUNWU_API_KEY
```

4. Set up database
```bash
# Create database
createdb picset_ai

# Run migrations (if using Alembic)
alembic upgrade head
```

5. Run development server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at http://localhost:8000

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Key Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login/json` - Login (returns JWT token)
- `GET /api/v1/auth/me` - Get current user

### Image Upload
- `POST /api/v1/upload/image` - Upload image file

### Tasks
- `POST /api/v1/tasks/studio-genesis` - Start Studio Genesis task
- `POST /api/v1/tasks/aesthetic-mirror` - Start Aesthetic Mirror task
- `GET /api/v1/tasks/{task_id}` - Get task status
- `WS /api/v1/tasks/ws/{task_id}` - Real-time progress updates

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT secret key (must be strong in production!)
- `YUNWU_API_KEY` - Your 云雾 API key for AI services
- `CORS_ORIGINS` - Allowed CORS origins (default: http://localhost:3000)

## Development Notes

### Frontend
- All pages use Server Components where possible
- Client Components marked with `'use client'`
- State management: Zustand for client state, React Query for server state
- Authentication token stored in localStorage
- WebSocket for real-time task progress

### Backend
- Async/await throughout (AsyncIO)
- Database sessions use async context managers
- Background tasks for long-running operations
- WebSocket connections managed per task
- Credit system for feature usage

## Credits System

Default credits on registration: 100

- Studio Genesis: 10 credits
- Aesthetic Mirror: 15 credits
- Refinement: 5 credits
- HD Export: 2 credits

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
