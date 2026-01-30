from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.application import Application, ApplicationStatus
from app.schemas.application import ApplicationCreate, ApplicationUpdate

async def get_applications(db: AsyncSession, skip: int = 0, limit: int = 100, user_id: Optional[int] = None) -> List[Application]:
    query = select(Application)
    if user_id:
        query = query.where(Application.user_id == user_id)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def get_application(db: AsyncSession, application_id: int) -> Optional[Application]:
    result = await db.execute(select(Application).where(Application.id == application_id))
    return result.scalars().first()

async def create_application(db: AsyncSession, application: ApplicationCreate, user_id: int) -> Application:
    db_application = Application(
        **application.dict(),
        user_id=user_id,
        status=ApplicationStatus.PENDING.value
    )
    db.add(db_application)
    await db.commit()
    await db.refresh(db_application)
    return db_application

async def update_application(db: AsyncSession, application_id: int, application_update: ApplicationUpdate) -> Optional[Application]:
    db_application = await get_application(db, application_id)
    if not db_application:
        return None
    
    update_data = application_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_application, key, value)
        
    db.add(db_application)
    await db.commit()
    await db.refresh(db_application)
    return db_application
