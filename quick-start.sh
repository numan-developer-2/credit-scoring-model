#!/bin/bash

# 🚀 Credit Scoring Platform - Quick Start Script
# This script sets up and runs the entire platform with one command

set -e

echo "🏦 Credit Scoring Platform - Quick Start"
echo "========================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/logs
mkdir -p ml-pipeline/data/{raw,processed,features,external,synthetic}
mkdir -p ml-pipeline/models/{saved_models,model_registry,configs}
mkdir -p database/{schemas,migrations,seeds,backups}
mkdir -p monitoring/prometheus/rules
mkdir -p monitoring/grafana/dashboards
echo "✅ Directories created"
echo ""

# Setup backend environment
echo "🔧 Setting up backend environment..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Backend .env created from template"
    echo "⚠️  Please update backend/.env with your settings"
else
    echo "✅ Backend .env already exists"
fi
echo ""

# Setup frontend environment
echo "🎨 Setting up frontend environment..."
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env created from template"
else
    echo "✅ Frontend .env already exists"
fi
echo ""

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo ""
echo "🔍 Checking service health..."

if curl -f http://localhost:8000/health &> /dev/null; then
    echo "✅ Backend is running at http://localhost:8000"
    echo "📚 API Docs available at http://localhost:8000/docs"
else
    echo "⚠️  Backend is starting... (may take a few more seconds)"
fi

if curl -f http://localhost:3000 &> /dev/null; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "⚠️  Frontend is starting... (may take a few more seconds)"
fi

echo ""
echo "🎉 Quick Start Complete!"
echo ""
echo "📊 Access Points:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "📝 Next Steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Login with any email/password (mock auth)"
echo "   3. Explore the dashboard and features"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose down"
echo ""
echo "📖 For detailed setup, see SETUP_GUIDE.md"
echo ""
