from typing import Any
from fastapi import APIRouter, Depends
from app.api import dependencies
from app.models.user import User
from app.schemas.application import ApplicationCreate
from app.services import credit_scoring_service

router = APIRouter()

@router.post("/calculate")
async def calculate_score(
    application_data: ApplicationCreate,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    # Logic is CPU bound, keep it simple for now or await if it was async
    score = credit_scoring_service.calculate_credit_score(application_data)
    return {"score": score}
