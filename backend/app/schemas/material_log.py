from pydantic import BaseModel
from datetime import datetime
from app.schemas.step import Step
from typing import List
from app.schemas.material import MaterialResponse

class MaterialLogResponse(BaseModel):
    id: int
    material_id: int
    changed_at: datetime
    from_step: Step
    to_step: Step
    material: MaterialResponse

    class Config:
        from_attributes = True
        
class StepCountResponse(BaseModel):
    step_id: int
    step_name: str
    total_passagens: int

class MaterialLogsWithCountsResponse(BaseModel):
    logs: List[MaterialLogResponse]
    step_counts: List[StepCountResponse]
