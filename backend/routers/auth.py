from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional
from database import get_session
from models import User, Facility
from utils.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    facility_id: Optional[int] = None

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_user(user_in: UserRegister, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        hashed_password=hashed_pwd,
        role=user_in.role,
        facility_id=user_in.facility_id
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user_in: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == user_in.email)).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role, "facility_id": user.facility_id}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "role": user.role,
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}",
            "facility_id": user.facility_id
        }
    }
