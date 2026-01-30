from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import dependencies
from app.models.user import User
from app.schemas.user import User as UserSchema

router = APIRouter()

@router.get("/users", response_model=List[UserSchema])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(dependencies.get_db),
    current_user: User = Depends(dependencies.get_current_active_superuser),
) -> Any:
    """
    Retrieve all users (Admin only).
    """
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    return users
