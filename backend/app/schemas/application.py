from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ApplicationBase(BaseModel):
    full_name: str
    email: str
    phone_number: str
    address: str
    annual_income: float
    employment_status: str
    loan_amount: float
    loan_purpose: str
    credit_score: Optional[int] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(ApplicationBase):
    status: Optional[str] = None

class ApplicationInDBBase(ApplicationBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class Application(ApplicationInDBBase):
    pass
