from pydantic import BaseModel
from datetime import datetime
from app.schemas.step import Step

class MaterialFailCreate(BaseModel):
    material_id: int
    step_id: int
    description: str

class MaterialFailResponse(BaseModel):
    id: int
    material_id: int
    step_id: int
    description: str
    created_at: datetime
    step: Step

    class Config:
        from_attributes = True
