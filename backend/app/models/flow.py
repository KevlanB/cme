from sqlalchemy import Column, Integer, String, Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

flow_steps = Table(
    'flow_steps',
    Base.metadata,
    Column('flow_id', Integer, ForeignKey('flows.id'), primary_key=True),
    Column('step_id', Integer, ForeignKey('steps.id'), primary_key=True)
)

class Flow(Base):
    __tablename__ = "flows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    materials = relationship("Material", back_populates="flow")
    
    steps = relationship(
        "Step",
        secondary=flow_steps,
        back_populates="flows"
    )
    