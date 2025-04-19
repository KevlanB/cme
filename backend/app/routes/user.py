from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import user as crud_user
from app.database.database import get_db
from app.utils.security import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=schemas.user.User)
def create_user(user: schemas.user.UserCreate, db: Session = Depends(get_db)):
    return crud_user.create_user(db, user)

@router.get("/", response_model=list[schemas.user.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_user.get_users(db, skip=skip, limit=limit)

@router.get("/{user_id}", response_model=schemas.user.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud_user.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="user não encontrado")
    return db_user

@router.put("/{user_id}", response_model=schemas.user.User)
def update_user(user_id: int, user: schemas.user.UserUpdate, db: Session = Depends(get_db)):
    updated = crud_user.update_user(db, user_id, user)
    if not updated:
        raise HTTPException(status_code=404, detail="user não encontrado")
    return updated

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted = crud_user.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="user não encontrado")
    return {"ok": True}

@router.get("/find/me", response_model=schemas.user.User)
def get_user_info(current_user: schemas.user.User = Depends(get_current_user)):
    return current_user