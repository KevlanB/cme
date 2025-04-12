from pydantic import BaseModel
from datetime import date
from typing import Optional
from datetime import datetime
from app.schemas.step import Step

class MaterialBase(BaseModel):
    name: str
    type: str
    expiration_date: Optional[date]

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    name: Optional[str] = None
    step: Optional[int] = None
    type: Optional[str] = None
    expiration_date: Optional[date] = None
    
class Material(MaterialBase):
    id: int
    serial: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    step: Step

    class Config:
        from_attributes = True
