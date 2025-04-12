from sqlalchemy.orm import Session
from app.schemas.role import RoleCreate
from app.models.role import Role

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Role).offset(skip).limit(limit).all()

def get_role(db: Session, role_id: int):
    return db.query(Role).filter(Role.id == role_id).first()

def create_role(db: Session, role: RoleCreate):
    db_role = Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def delete_role(db: Session, role_id: int):
    role = db.query(Role).filter(Role.id == role_id).first()
    if role:
        db.delete(role)
        db.commit()
    return role

def update_role(db: Session, role_id: int, role_data: RoleCreate):
    role = db.query(Role).filter(Role.id == role_id).first()
    if role:
        for key, value in role_data.dict().items():
            setattr(role, key, value)
        db.commit()
        db.refresh(role)
    return role
