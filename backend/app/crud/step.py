from sqlalchemy.orm import Session
from app.schemas.step import StepCreate
from app.models.step import Step

def get_steps(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Step).offset(skip).limit(limit).all()

def get_step(db: Session, step_id: int):
    return db.query(Step).filter(Step.id == step_id).first()

def create_step(db: Session, step: StepCreate):
    db_step = Step(**step.dict())
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step

def delete_step(db: Session, step_id: int):
    step = db.query(Step).filter(Step.id == step_id).first()
    if step:
        db.delete(step)
        db.commit()
    return step

def update_step(db: Session, step_id: int, step_data: StepCreate):
    step = db.query(Step).filter(Step.id == step_id).first()
    if step:
        for key, value in step_data.dict().items():
            setattr(step, key, value)
        db.commit()
        db.refresh(step)
    return step
