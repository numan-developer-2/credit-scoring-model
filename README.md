# 🏦 Credit Scoring Platform

A complete, production-ready, enterprise-level credit scoring platform that financial institutions can use to assess creditworthiness using machine learning.

## 🎯 Features

- **Credit Scoring Engine**: ML-powered credit assessment with explainability
- **Application Management**: Complete CRUD operations for credit applications
- **Analytics Dashboard**: Real-time insights with interactive charts
- **User Authentication**: Secure JWT-based authentication
- **Role-Based Access Control**: Admin, Analyst, Operator, Viewer roles
- **Dark Mode Support**: Full light/dark theme switching
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Async Architecture**: High-performance async backend

## 🛠️ Technology Stack

### Backend

- **FastAPI** - Modern async Python web framework
- **SQLAlchemy** - Async ORM for database operations
- **PostgreSQL/SQLite** - Database (async drivers)
- **JWT** - Secure authentication
- **Pydantic** - Data validation
- **Alembic** - Database migrations
- **Loguru** - Advanced logging

### Frontend

- **React 18** - Modern UI library
- **Material-UI v5** - Component library
- **Redux Toolkit** - State management
- **React Query** - Data fetching
- **Recharts** - Data visualization
- **Formik + Yup** - Form validation
- **Vite** - Fast build tool

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL (optional, SQLite works too)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

Backend will run at: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
credit-scoring-platform/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Config, security, logging
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── database/       # DB session
│   ├── alembic/            # Migrations
│   └── requirements.txt
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   └── styles/        # Themes & styles
│   └── package.json
│
└── docker-compose.yml     # Docker orchestration
```

## 🔑 Default Credentials

For testing purposes:

- **Email**: Any valid email
- **Password**: Any password (mock auth)

## 📊 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login/access-token` - Login

### Applications

- `POST /api/v1/applications` - Create application
- `GET /api/v1/applications` - List applications
- `GET /api/v1/applications/{id}` - Get application

### Scoring

- `POST /api/v1/scoring/calculate` - Calculate credit score

### Analytics

- `GET /api/v1/analytics/dashboard` - Dashboard stats

### Admin

- `GET /api/v1/admin/users` - List users (admin only)

## 🎨 Features Overview

### Dashboard

- 4 key metric cards with trends
- Application trends bar chart
- Risk distribution pie chart
- Credit score trends line chart

### Credit Scoring

- Comprehensive application form
- Real-time validation
- Credit score calculation (300-850)
- Risk level assessment
- Approval probability
- Contributing factors analysis

### Applications

- Searchable data table
- Status and risk filters
- Pagination
- Export functionality
- Responsive design

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:

```env
DATABASE_URL=sqlite+aiosqlite:///./credit_scoring.db
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=11520
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

**Frontend (.env)**:

```env
VITE_API_URL=http://localhost:8000
```

## 📝 Development

### Backend Development

```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

### Frontend Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [Project Summary](./PROJECT_SUMMARY.md) - Architecture overview
- [API Documentation](http://localhost:8000/docs) - Interactive API docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- FastAPI for the amazing framework
- Material-UI for beautiful components
- Recharts for data visualization

## 📞 Support

For support, email support@creditscore.com or open an issue.

---

**Built with ❤️ for financial institutions**
