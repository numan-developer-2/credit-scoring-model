from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.database.session import Base

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)
    default_risk_score = Column(Float, nullable=False)
    fraud_risk_score = Column(Float, nullable=False)
    risk_factors = Column(JSON, nullable=True)  # Contributing factors
    feature_contributions = Column(JSON, nullable=True)  # SHAP values
    model_version = Column(String, default="v1.0.0")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
