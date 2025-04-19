from pydantic import BaseModel, constr
from typing import List, Optional
from .step import Step  # importa o schema Step!

class FlowBase(BaseModel):
    name: str

class FlowCreate(FlowBase):
    step_ids: List[int] = []

class FlowUpdate(FlowBase):
    step_ids: Optional[List[int]] = []

class Flow(FlowBase):
    id: int
    steps: List[Step]  

    class Config:
        from_attributes = True
