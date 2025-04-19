from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import flow as crud_flow
from app.database.database import get_db

router = APIRouter(prefix="/flows", tags=["Flows"])

@router.post("/", response_model=schemas.flow.Flow)
def create_flow(flow: schemas.flow.FlowCreate, db: Session = Depends(get_db)):
    if not flow.name.strip():
        raise HTTPException(status_code=400, detail="O nome do fluxo é obrigatório.")
    
    if not flow.step_ids:
        raise HTTPException(status_code=400, detail="É necessário selecionar ao menos uma etapa.")
    
    return crud_flow.create_flow(db, flow)

@router.get("/", response_model=list[schemas.flow.Flow])
def read_flows(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_flow.get_flows(db, skip=skip, limit=limit)

@router.get("/{flow_id}", response_model=schemas.flow.Flow)
def read_flow(flow_id: int, db: Session = Depends(get_db)):
    db_flow = crud_flow.get_flow(db, flow_id)
    if not db_flow:
        raise HTTPException(status_code=404, detail="fluxo não encontrado")
    return db_flow

@router.put("/{flow_id}", response_model=schemas.flow.Flow)
def update_flow(flow_id: int, flow: schemas.flow.FlowUpdate, db: Session = Depends(get_db)):
    updated = crud_flow.update_flow(db, flow_id, flow)
    if not updated:
        raise HTTPException(status_code=404, detail="fluxo não encontrado")
    return updated


@router.delete("/{flow_id}")
def delete_flow(flow_id: int, db: Session = Depends(get_db)):
    deleted = crud_flow.delete_flow(db, flow_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="fluxo não encontrado")
    return {"ok": True}
