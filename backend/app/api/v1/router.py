from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, applications, analytics, scoring, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(scoring.router, prefix="/scoring", tags=["scoring"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

@api_router.get("/health")
async def health_check():
    return {"status": "ok"}
