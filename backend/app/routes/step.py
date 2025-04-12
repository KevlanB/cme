from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import step as crud_step
from app.database.database import get_db

router = APIRouter(prefix="/steps", tags=["Steps"])

@router.post("/", response_model=schemas.step.Step)
def create_step(step: schemas.step.StepCreate, db: Session = Depends(get_db)):
    return crud_step.create_step(db, step)

@router.get("/", response_model=list[schemas.step.Step])
def read_steps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_step.get_steps(db, skip=skip, limit=limit)

@router.get("/{step_id}", response_model=schemas.step.Step)
def read_step(step_id: int, db: Session = Depends(get_db)):
    db_step = crud_step.get_step(db, step_id)
    if not db_step:
        raise HTTPException(status_code=404, detail="setor não encontrado")
    return db_step

@router.put("/{step_id}", response_model=schemas.step.Step)
def update_step(step_id: int, step: schemas.step.StepCreate, db: Session = Depends(get_db)):
    updated = crud_step.update_step(db, step_id, step)
    if not updated:
        raise HTTPException(status_code=404, detail="setor não encontrado")
    return updated

@router.delete("/{step_id}")
def delete_step(step_id: int, db: Session = Depends(get_db)):
    deleted = crud_step.delete_step(db, step_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="setor não encontrado")
    return {"ok": True}
