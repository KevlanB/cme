from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app import schemas
from app.crud import material as crud_material
from app.crud import material_fail as crud_material_fail
from app.database.database import get_db
from app.models.material_log import MaterialLog
from app.schemas.material_log import MaterialLogResponse, StepCountResponse, MaterialLogsWithCountsResponse
from app.models.material import Material
from app.models.step import Step
from sqlalchemy import func
from datetime import date, datetime, time
from typing import List
from fastapi import APIRouter, Depends, Query
from app.schemas.material_fail import MaterialFailResponse

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

@router.patch("/{material_id}/next-step")
def move_material_to_next_step(material_id: int, db: Session = Depends(get_db)):
    material = db.query(Material).filter(Material.id == material_id).first()

    if not material:
        raise HTTPException(status_code=404, detail="Material não encontrado.")

    if material.step_id is None:
        raise HTTPException(status_code=400, detail="Material não possui etapa atual.")

    from_step = material.step_id

    # Definindo a última etapa cadastrada
    last_step = db.query(Step).count()  # Supondo que a tabela Steps tenha todas as etapas cadastradas

    # Se a etapa atual for a última, volta para a primeira
    if from_step == last_step:
        to_step = 1
        message = f"Material {material.id} voltou para a primeira etapa."
    else:
        to_step = from_step + 1
        message = f"Material {material.id} avançado para a etapa {to_step}."

    # Atualizando a etapa do material
    material.step_id = to_step

    # Logando a mudança
    log = MaterialLog(
        material_id=material.id,
        from_step_id=from_step,
        to_step_id=to_step
    )
    db.add(log)

    db.commit()
    db.refresh(material)

    return {"message": message}



    
@router.get("/logs/all", response_model=list[MaterialLogResponse])
def get_all_material_logs(
    start_date: datetime = Query(..., description="Data inicial"),
    end_date: datetime = Query(..., description="Data final"),
    db: Session = Depends(get_db)
):
    
    logs = (
        db.query(MaterialLog)
        .options(
            joinedload(MaterialLog.from_step),
            joinedload(MaterialLog.to_step),
            joinedload(MaterialLog.material)  
        )
        .filter(MaterialLog.changed_at >= start_date, MaterialLog.changed_at <= end_date)
        .all()
    )

   
    return logs


@router.get("/logs/by-serial/{serial}", response_model=list[MaterialLogResponse])
def get_logs_by_serial(
    serial: str,
    db: Session = Depends(get_db)
):
    logs = (
        db.query(MaterialLog)
        .join(MaterialLog.material)  # Faz o JOIN com a tabela Material
        .options(
            joinedload(MaterialLog.from_step),
            joinedload(MaterialLog.to_step),
            joinedload(MaterialLog.material)
        )
        .filter(Material.serial == serial)
        .all()
    )

    return logs


@router.get("/logs/{material_id}", response_model=MaterialLogsWithCountsResponse)
def get_material_logs(material_id: int, db: Session = Depends(get_db)):
    # Buscar logs detalhados
    logs = db.query(MaterialLog) \
        .options(
            joinedload(MaterialLog.from_step),
            joinedload(MaterialLog.to_step)
        ) \
        .filter(MaterialLog.material_id == material_id) \
        .all()

    # Buscar falhas associadas ao material
    material_fails = crud_material_fail.get_material_fails(db=db, material_id=material_id)

    # Converter falhas para o formato Pydantic (MaterialFailResponse)
    material_fails_response = [MaterialFailResponse.from_orm(fail) for fail in material_fails]

    # Verificar se falhas foram encontradas
    if not material_fails_response:
        raise HTTPException(status_code=404, detail="Falhas não encontradas para este material")

    # Contar passagens por step com nome
    step_counts_query = db.query(
        MaterialLog.to_step_id.label("step_id"),
        Step.name.label("step_name"),
        func.count(MaterialLog.to_step_id).label("total_passagens")
    ).join(
        Step, Step.id == MaterialLog.to_step_id
    ).filter(
        MaterialLog.material_id == material_id
    ).group_by(
        MaterialLog.to_step_id, Step.name
    ).all()

    step_counts = [
        StepCountResponse(
            step_id=row.step_id,
            step_name=row.step_name,
            total_passagens=row.total_passagens
        ) for row in step_counts_query
    ]

    return {
        "logs": logs,
        "fails": material_fails_response,
        "step_counts": step_counts
    }



@router.post("/fails/{material_id}", response_model=schemas.material_fail.MaterialFailResponse)
def create_material_fail(material_id: int, step_id: int, description: str, db: Session = Depends(get_db)):
    # Criar falha
    material_fail = crud_material_fail.create_material_fail(db=db, material_id=material_id, step_id=step_id, description=description)
    if not material_fail:
        raise HTTPException(status_code=404, detail="Material não encontrado")
    return material_fail

@router.get("/fails/{material_id}", response_model=list[schemas.material_fail.MaterialFailResponse])
def get_material_fails(material_id: int, db: Session = Depends(get_db)):
    # Retornar falhas de um material
    material_fails = crud_material_fail.get_material_fails(db=db, material_id=material_id)
    if not material_fails:
        raise HTTPException(status_code=404, detail="Falhas não encontradas para este material")
    return material_fails

