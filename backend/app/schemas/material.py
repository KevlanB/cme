from pydantic import BaseModel
from datetime import date
from typing import Optional
from datetime import datetime
from app.schemas.step import Step
from app.schemas.flow import Flow

class MaterialBase(BaseModel):
    name: str
    type: str
    expiration_date: Optional[date]
    flow_id: int

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    name: Optional[str] = None
    step_id: Optional[int] = None
    type: Optional[str] = None
    expiration_date: Optional[date] = None
    flow_id: Optional[int] = None

class Material(MaterialBase):
    id: int
    serial: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    step: Step
    flow: Flow

    class Config:
        from_attributes = True

class MaterialResponse(BaseModel):
    id: int
    name: str
    type: str
    serial: str
    expiration_date: Optional[date]
    
    class Config:
        from_attributes = True
