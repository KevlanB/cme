from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import datetime

class MaterialLog(Base):
    __tablename__ = "material_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("materials.id"), nullable=False)
    from_step_id = Column(Integer, ForeignKey("steps.id"), nullable=False)  
    to_step_id = Column(Integer, ForeignKey("steps.id"), nullable=False)    
    changed_at = Column(DateTime, default=datetime.utcnow)

    material = relationship("Material")
    from_step = relationship("Step", foreign_keys=[from_step_id])  
    to_step = relationship("Step", foreign_keys=[to_step_id])      
