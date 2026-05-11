from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from database import get_session
from models import JobRequest, Quote, User
from utils.auth import get_current_user

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

@router.get("/quotes/job/{job_id}", response_model=List[Quote])
def get_quotes_for_job(job_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    quotes = session.exec(select(Quote).where(Quote.job_request_id == job_id)).all()
    return quotes

@router.post("/quotes/{quote_id}/accept")
def accept_quote(quote_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # 1. Verify user is a manager
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Not authorized")

    # 2. Fetch the quote and related job
    quote = session.get(Quote, quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
        
    job = session.get(JobRequest, quote.job_request_id)
    
    # 3. Update the winning quote and the job status
    quote.status = "accepted"
    job.status = "dispatched"
    
    # 4. Auto-decline all other quotes for this job
    other_quotes = session.exec(select(Quote).where(Quote.job_request_id == job.id, Quote.id != quote_id)).all()
    for oq in other_quotes:
        oq.status = "declined"
        
    session.commit()
    return {"message": "Job successfully awarded and dispatched!"}
