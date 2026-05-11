from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel
from database import get_session
from models import User, Facility
from utils.auth import get_password_hash, verify_admin
from typing import List

router = APIRouter(tags=["Admin"])

class FacilityCreate(BaseModel):
    name: str
    type: str
    subscription_plan: str

class ManagerCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    facility_id: int

@router.post("/facilities")
def create_facility(facility: FacilityCreate, session: Session = Depends(get_session), admin: User = Depends(verify_admin)):
    new_facility = Facility(
        name=facility.name, 
        type=facility.type, 
        subscription_plan=facility.subscription_plan, 
        status="active"
    )
    session.add(new_facility)
    session.commit()
    session.refresh(new_facility)
    return new_facility

@router.get("/facilities", response_model=List[Facility])
def get_facilities(session: Session = Depends(get_session), admin: User = Depends(verify_admin)):
    return session.query(Facility).all()

@router.post("/managers")
def create_manager(manager: ManagerCreate, session: Session = Depends(get_session), admin: User = Depends(verify_admin)):
    existing = session.query(User).filter(User.email == manager.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_manager = User(
        first_name=manager.first_name,
        last_name=manager.last_name,
        email=manager.email,
        hashed_password=get_password_hash(manager.password),
        role="manager",
        facility_id=manager.facility_id
    )
    session.add(new_manager)
    session.commit()
    return {"message": f"Manager {manager.first_name} created successfully."}
