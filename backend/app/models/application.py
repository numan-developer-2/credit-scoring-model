from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from app.database.session import Base
import enum

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String, index=True)
    email = Column(String, index=True)
    phone_number = Column(String)
    address = Column(String)
    annual_income = Column(Float)
    employment_status = Column(String)
    loan_amount = Column(Float)
    loan_purpose = Column(String)
    credit_score = Column(Integer, nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
