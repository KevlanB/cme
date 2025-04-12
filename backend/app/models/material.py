from sqlalchemy import Column, Integer, String, DateTime, func, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class Material(Base):
    __tablename__ = "materials"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String, nullable=False)
    expiration_date = Column(Date, nullable=True)
    serial = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    step_id = Column(Integer, ForeignKey("steps.id"))
    step = relationship("Step", back_populates="materials")
