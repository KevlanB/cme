from pydantic import BaseModel

class StepBase(BaseModel):
    name: str

class StepCreate(StepBase):
    pass

class StepUpdate(StepBase):
    pass

class Step(StepBase):
    id: int

    class Config:
        from_attributes = True
