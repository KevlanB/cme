from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    username = username = Column(String, unique=True, index=True)
    password = Column(String(128), nullable=False)
    active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)
    
    # relacionamento com Role
    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", back_populates="users")
