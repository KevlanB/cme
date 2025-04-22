from sqlalchemy.orm import Session
from app.models.material_fail import MaterialFail
from app.schemas.material_fail import MaterialFailResponse
from app.models.material import Material

def create_material_fail(db: Session, material_id: int, step_id: int, description: str):
    # Criação de um novo MaterialFail com step_id
    material_fail = MaterialFail(
        material_id=material_id,
        step_id=step_id,  # Incluindo o step_id
        description=description
    )
    db.add(material_fail)
    db.commit()
    db.refresh(material_fail)
    return material_fail

def get_material_fails(db: Session, material_id: int):
    # Retorna todas as falhas de um material
    return db.query(MaterialFail).filter(MaterialFail.material_id == material_id).all()