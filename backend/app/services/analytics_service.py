from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from app.models.application import Application, ApplicationStatus

async def get_dashboard_stats(db: AsyncSession):
    # Async scalar queries
    total_result = await db.execute(select(func.count(Application.id)))
    total_applications = total_result.scalar() or 0
    
    approved_result = await db.execute(select(func.count(Application.id)).where(Application.status == ApplicationStatus.APPROVED.value))
    approved_applications = approved_result.scalar() or 0
    
    avg_loan_result = await db.execute(select(func.avg(Application.loan_amount)))
    avg_loan_amount = avg_loan_result.scalar() or 0
    
    avg_score_result = await db.execute(select(func.avg(Application.credit_score)))
    avg_credit_score = avg_score_result.scalar() or 0
    
    return {
        "total_applications": total_applications,
        "approval_rate": (approved_applications / total_applications * 100) if total_applications > 0 else 0,
        "average_loan_amount": round(avg_loan_amount, 2),
        "average_credit_score": int(avg_credit_score)
    }
