from uuid import uuid4
from sqlalchemy.orm import Session
from app.schemas.material import MaterialCreate, MaterialUpdate
from app.models.material import Material
from datetime import datetime

def get_materials(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Material).offset(skip).limit(limit).all()

def get_material(db: Session, material_id: int):
    return db.query(Material).filter(Material.id == material_id).first()

def generate_serial(name: str, created_at: datetime) -> str:
    name_part = name.replace(" ", "").upper()[:3]
    date_part = created_at.strftime("%Y%m%d")
    uuid_part = uuid4().hex[:6].upper()
    return f"{name_part}-{date_part}-{uuid_part}"

def create_material(db: Session, material: MaterialCreate):
    data = material.dict()
    created_at = datetime.now()
    serial = generate_serial(data['name'], created_at)
    db_material = Material(**data, serial=serial, step_id=1)
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

def delete_material(db: Session, material_id: int):
    material = db.query(Material).filter(Material.id == material_id).first()
    if material:
        db.delete(material)
        db.commit()
    return material

def update_material(db: Session, material_id: int, material_update: MaterialUpdate):
    material = db.query(Material).filter(Material.id == material_id).first()
    
    print(material)
    if not material:
        return None

    update_data = material_update.dict(exclude_unset=True)  # só atualiza o que foi enviado
    for key, value in update_data.items():
        setattr(material, key, value)

    db.commit()
    db.refresh(material)
    return material
