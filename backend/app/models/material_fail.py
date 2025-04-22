from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database.database import Base

class MaterialFail(Base):
    __tablename__ = "material_fails"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("materials.id"), nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    step_id = Column(Integer, ForeignKey("steps.id"), nullable=True)

    material = relationship("Material", back_populates="fails")
    step = relationship("Step", back_populates="material_fails")