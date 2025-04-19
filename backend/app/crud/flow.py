from sqlalchemy.orm import Session
from app.schemas.flow import FlowCreate
from app.models.flow import Flow
from app.models.step import Step

def get_flows(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Flow).offset(skip).limit(limit).all()

def get_flow(db: Session, flow_id: int) -> Flow:
    return db.query(Flow).filter(Flow.id == flow_id).first()

def create_flow(db: Session, flow: FlowCreate):
    db_flow = Flow(name=flow.name)

    if flow.step_ids:
        steps = db.query(Step).filter(Step.id.in_(flow.step_ids)).all()
        db_flow.steps = steps

    db.add(db_flow)
    db.commit()
    db.refresh(db_flow)
    return db_flow

def delete_flow(db: Session, flow_id: int):
    flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if flow:
        db.delete(flow)
        db.commit()
    return flow

def update_flow(db: Session, flow_id: int, flow_data: FlowCreate):
    flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if flow:
        flow.name = flow_data.name

        if flow_data.step_ids is not None:
            steps = db.query(Step).filter(Step.id.in_(flow_data.step_ids)).all()
            flow.steps = steps

        db.commit()
        db.refresh(flow)
    return flow

