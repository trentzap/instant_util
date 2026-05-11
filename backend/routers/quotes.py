from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from ..database import get_session
from ..models import JobRequest, Quote, User
from ..utils.auth import get_current_user

router = APIRouter(tags=["Marketplace"])

class QuoteCreate(BaseModel):
    job_request_id: int
    price: float
    eta: str
    note: str

@router.get("/marketplace/jobs", response_model=List[JobRequest])
def get_marketplace_jobs(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != 'contractor':
        raise HTTPException(status_code=403, detail="Only contractors can view the marketplace")
    # Return all open jobs
    jobs = session.exec(select(JobRequest).where(JobRequest.status == "open")).all()
    return jobs

@router.post("/quotes/", response_model=Quote)
def submit_quote(quote_in: QuoteCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != 'contractor':
        raise HTTPException(status_code=403, detail="Only contractors can submit quotes")
        
    quote = Quote(
        job_request_id=quote_in.job_request_id,
        contractor_id=current_user.id,
        price=quote_in.price,
        eta=quote_in.eta,
        note=quote_in.note,
        status="pending"
    )
    session.add(quote)
    session.commit()
    session.refresh(quote)
    
    # Optionally update the job status to 'pending quotes'
    job = session.get(JobRequest, quote_in.job_request_id)
    if job and job.status == "open":
        job.status = "pending quotes"
        session.add(job)
        session.commit()
        
    return quote
