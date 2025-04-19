from pydantic import BaseModel
from app.schemas.role import Role
from typing import Optional

class UserBase(BaseModel):
    name: str
    username: str
    password: str
    role_id: int
    active: Optional[bool] = True

class UserCreate(UserBase):
   pass

class UserUpdate(UserBase):
    name: str
    username: str
    password: str
    role_id: int
    active: Optional[bool] = True

class User(UserBase):
    id: int
    role: Role

    class Config:
        from_attributes = True