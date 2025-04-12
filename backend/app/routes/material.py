from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import material as crud_material
from app.database.database import get_db

router = APIRouter(prefix="/materials", tags=["Materials"])

@router.post("/", response_model=schemas.material.Material)
def create_material(material: schemas.material.MaterialCreate, db: Session = Depends(get_db)):
    return crud_material.create_material(db, material)

@router.get("/", response_model=list[schemas.material.Material])
def read_materials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_material.get_materials(db, skip=skip, limit=limit)

@router.get("/{material_id}", response_model=schemas.material.Material)
def read_material(material_id: int, db: Session = Depends(get_db)):
    db_material = crud_material.get_material(db, material_id)
    if not db_material:
        raise HTTPException(status_code=404, detail="Material não encontrado")
    return db_material

@router.patch("/{material_id}", response_model=schemas.material.Material)
def update_material(material_id: int, material: schemas.material.MaterialUpdate, db: Session = Depends(get_db)):
    updated = crud_material.update_material(db, material_id, material)
    if not updated:
        raise HTTPException(status_code=404, detail="Material não encontrado")
    return updated

@router.delete("/{material_id}")
def delete_material(material_id: int, db: Session = Depends(get_db)):
    deleted = crud_material.delete_material(db, material_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Material não encontrado")
    return {"ok": True}
