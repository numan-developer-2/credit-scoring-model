from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import dependencies
from app.schemas.application import Application, ApplicationCreate, ApplicationUpdate
from app.services import application_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Application])
async def read_applications(
    db: AsyncSession = Depends(dependencies.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    if current_user.is_superuser:
        return await application_service.get_applications(db, skip=skip, limit=limit)
    return await application_service.get_applications(db, skip=skip, limit=limit, user_id=current_user.id)

@router.post("/", response_model=Application)
async def create_application(
    *,
    db: AsyncSession = Depends(dependencies.get_db),
    application_in: ApplicationCreate,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    return await application_service.create_application(db, application_in, user_id=current_user.id)

@router.get("/{id}", response_model=Application)
async def read_application(
    *,
    db: AsyncSession = Depends(dependencies.get_db),
    id: int,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    application = await application_service.get_application(db, id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if not current_user.is_superuser and application.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return application
