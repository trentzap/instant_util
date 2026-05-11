from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel
from database import get_session
from models import JobRequest, User
from utils.auth import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])

class JobRequestCreate(BaseModel):
    category: str
    description: str
    urgency: str

@router.post("/", response_model=JobRequest)
def create_job(job_in: JobRequestCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if not current_user.facility_id:
         raise HTTPException(status_code=400, detail="User is not assigned to a facility")
         
    job = JobRequest(
        category=job_in.category,
        description=job_in.description,
        urgency=job_in.urgency,
        facility_id=current_user.facility_id,
        resident_id=current_user.id,
        status="open"
    )
    session.add(job)
    session.commit()
    session.refresh(job)
    return job

@router.get("/", response_model=List[JobRequest])
def get_jobs(status: Optional[str] = None, urgency: Optional[str] = None, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if not current_user.facility_id:
         raise HTTPException(status_code=400, detail="User is not assigned to a facility")

    # Filter jobs by the manager's facility
    query = select(JobRequest).where(JobRequest.facility_id == current_user.facility_id)
    if status and status != 'all':
        query = query.where(JobRequest.status == status)
    if urgency and urgency != 'all':
        query = query.where(JobRequest.urgency == urgency)
        
    jobs = session.exec(query).all()
    return jobs
