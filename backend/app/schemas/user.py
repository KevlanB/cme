from pydantic import BaseModel
from app.schemas.role import Role
from typing import Optional

class UserBase(BaseModel):
    name: str
    username: str
    role_id: int
    active: Optional[bool] = True

class UserCreate(UserBase):
    password: str  # Obrigatório ao criar!

class UserUpdate(BaseModel):
    name: str
    username: str
    password: Optional[str] = None  # Opcional no update
    role_id: int
    active: bool

class User(UserBase):
    id: int
    role: Role

    class Config:
        from_attributes = True
