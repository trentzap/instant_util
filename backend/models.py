from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    first_name: str
    last_name: str
    email: str = Field(unique=True)
    phone: Optional[str]
    role: str # 'admin', 'manager', 'resident', 'contractor'
    facility_id: Optional[int] = Field(default=None, foreign_key="facility.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Facility(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str # 'residential', 'commercial'
    subscription_plan: str # 'basic', 'premium'
    status: str # 'active'

class JobRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    resident_id: int = Field(foreign_key="user.id")
    facility_id: int = Field(foreign_key="facility.id")
    category: str
    description: str
    urgency: str # 'normal', 'high', 'urgent'
    status: str # 'open', 'dispatched', 'resolved'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Quote(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_request_id: int = Field(foreign_key="jobrequest.id")
    contractor_id: int = Field(foreign_key="user.id")
    price: float
    eta: str
    note: Optional[str]
    status: str # 'pending', 'accepted', 'declined'

class SosAlert(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    resident_id: int = Field(foreign_key="user.id")
    facility_id: int = Field(foreign_key="facility.id")
    message: str
    tap_count: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
