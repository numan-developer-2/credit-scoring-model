# 📖 Setup Guide - Credit Scoring Platform

Complete step-by-step guide to set up the Credit Scoring Platform.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9 or higher**
- **Node.js 16 or higher**
- **PostgreSQL 13+** (optional, SQLite works for development)
- **Git**
- **Docker & Docker Compose** (optional)

## 🔧 Backend Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd credit-scoring-platform
```

### Step 2: Create Virtual Environment

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
# Windows: notepad .env
# Mac/Linux: nano .env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./credit_scoring.db
# For PostgreSQL: postgresql+asyncpg://user:password@localhost:5432/dbname

# Security
SECRET_KEY=generate-a-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

**Generate SECRET_KEY:**

```bash
# Option 1: Python
python -c "import secrets; print(secrets.token_hex(32))"

# Option 2: OpenSSL
openssl rand -hex 32
```

### Step 5: Initialize Database

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### Step 6: Start Backend Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Verify Backend:**

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env
```

**Environment Variables:**

```env
VITE_API_URL=http://localhost:8000
```

### Step 4: Start Development Server

```bash
npm run dev
```

**Verify Frontend:**

- App: http://localhost:3000

---

## 🐳 Docker Setup

### Option 1: Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

**Access Services:**

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Individual Docker Containers

**Backend:**

```bash
cd backend
docker build -t credit-backend .
docker run -p 8000:8000 \
  -e DATABASE_URL=sqlite+aiosqlite:///./credit_scoring.db \
  -e SECRET_KEY=your-secret-key \
  credit-backend
```

**Frontend:**

```bash
cd frontend
docker build -t credit-frontend .
docker run -p 3000:3000 credit-frontend
```

---

## 🗄️ Database Setup

### SQLite (Development)

No additional setup needed. Database file will be created automatically.

### PostgreSQL (Production)

**1. Install PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Mac (Homebrew)
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

**2. Create Database**

```bash
# Access PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE credit_scoring_db;
CREATE USER credituser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE credit_scoring_db TO credituser;
\q
```

**3. Update .env**

```env
DATABASE_URL=postgresql+asyncpg://credituser:your_password@localhost:5432/credit_scoring_db
```

**4. Run Migrations**

```bash
alembic upgrade head
```

---

## 🧪 Verification

### Test Backend

```bash
# Health check
curl http://localhost:8000/health

# API documentation
open http://localhost:8000/docs
```

### Test Frontend

1. Open http://localhost:3000
2. Navigate to Login page
3. Enter any email/password (mock auth)
4. Verify dashboard loads

### Test Full Stack

1. **Register User:**
   - Go to Register page
   - Fill form and submit
   - Check backend logs for user creation

2. **Calculate Credit Score:**
   - Go to Credit Scoring page
   - Fill application form
   - Submit and verify results

3. **View Applications:**
   - Go to Applications page
   - Verify table displays data
   - Test filters and search

---

## 🔍 Troubleshooting

### Backend Issues

**Issue: ModuleNotFoundError**

```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt
```

**Issue: Database connection error**

```bash
# Solution: Check DATABASE_URL in .env
# Verify PostgreSQL is running
sudo systemctl status postgresql
```

**Issue: Alembic migration error**

```bash
# Solution: Reset migrations
alembic downgrade base
alembic upgrade head
```

### Frontend Issues

**Issue: npm install fails**

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Port 3000 already in use**

```bash
# Solution: Use different port
npm run dev -- --port 3001
```

**Issue: API connection error**

```bash
# Solution: Verify VITE_API_URL in .env
# Check backend is running
curl http://localhost:8000/health
```

### Docker Issues

**Issue: Port already in use**

```bash
# Solution: Stop conflicting services
docker-compose down
# Or change ports in docker-compose.yml
```

**Issue: Build fails**

```bash
# Solution: Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 🚀 Production Deployment

### Backend

**1. Update Environment**

```env
DEBUG=False
DATABASE_URL=postgresql+asyncpg://user:pass@prod-db:5432/dbname
SECRET_KEY=strong-production-secret
```

**2. Run with Gunicorn**

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend

**1. Build Production Bundle**

```bash
npm run build
```

**2. Serve with Nginx**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

---

## 📊 Next Steps

1. **Customize Configuration**
   - Update branding
   - Configure email settings
   - Set up monitoring

2. **Add Real ML Model**
   - Train credit scoring model
   - Replace mock scoring logic
   - Add model versioning

3. **Set Up CI/CD**
   - Configure GitHub Actions
   - Add automated tests
   - Set up deployment pipeline

4. **Enable Monitoring**
   - Set up Prometheus
   - Configure Grafana dashboards
   - Add error tracking

---

## 📞 Support

If you encounter issues:

1. Check logs: `docker-compose logs`
2. Review documentation
3. Open an issue on GitHub
4. Contact support team

---

**Setup complete! 🎉**
