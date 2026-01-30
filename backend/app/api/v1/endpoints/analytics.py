from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import dependencies
from app.services import analytics_service
from app.models.user import User

router = APIRouter()

@router.get("/dashboard")
async def read_dashboard_stats(
    db: AsyncSession = Depends(dependencies.get_db),
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    return await analytics_service.get_dashboard_stats(db)
