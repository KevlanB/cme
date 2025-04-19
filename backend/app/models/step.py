from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.database import Base
from app.models.flow import flow_steps


class Step(Base):
    __tablename__ = "steps"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    materials = relationship("Material", back_populates="step")
    
    flows = relationship(
        "Flow",
        secondary="flow_steps",
        back_populates="steps"
    )
