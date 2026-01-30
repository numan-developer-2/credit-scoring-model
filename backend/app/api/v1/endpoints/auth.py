from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import dependencies
from app.core import security
from app.core.config import settings
from app.services import auth_service
from app.schemas.token import Token
from app.schemas.user import User, UserCreate

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    user_in: UserLogin,
    db: AsyncSession = Depends(dependencies.get_db),
) -> Any:
    user = await auth_service.authenticate_user(db, user_in)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/register", response_model=User)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(dependencies.get_db),
) -> Any:
    user = await auth_service.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = await auth_service.create_user(db, user_in)
    return user
