from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import role as crud_role
from app.database.database import get_db

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=schemas.role.Role)
def create_role(role: schemas.role.RoleCreate, db: Session = Depends(get_db)):
    return crud_role.create_role(db, role)

@router.get("/", response_model=list[schemas.role.Role])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_role.get_roles(db, skip=skip, limit=limit)

@router.get("/{role_id}", response_model=schemas.role.Role)
def read_role(role_id: int, db: Session = Depends(get_db)):
    db_role = crud_role.get_role(db, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="função não encontrada")
    return db_role

@router.put("/{role_id}", response_model=schemas.role.Role)
def update_role(role_id: int, role: schemas.role.RoleCreate, db: Session = Depends(get_db)):
    updated = crud_role.update_role(db, role_id, role)
    if not updated:
        raise HTTPException(status_code=404, detail="função não encontrada")
    return updated

@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    deleted = crud_role.delete_role(db, role_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="função não encontrada")
    return {"ok": True}
