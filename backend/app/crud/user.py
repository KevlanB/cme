from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User
from app.utils.security import hash_password

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).filter(User.is_deleted == False).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id, User.is_deleted == False).first()

def create_user(db: Session, user: UserCreate):
    user_data = user.dict()
    user_data["password"] = hash_password(user.password)  # aqui criptografa a senha
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Soft delete
def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.is_deleted = True
        db.commit()
        db.refresh(user)
    return user


def update_user(db: Session, user_id: int, user_data: UserUpdate):
    user = db.query(User).filter(User.id == user_id).first()

    if user:
        user_data_dict = user_data.dict(exclude_unset=True)
        for key, value in user_data_dict.items():
            if key == "password" and value is not None:
                setattr(user, key, hash_password(value))  # criptografa a senha
            elif key != "password":
                setattr(user, key, value)

        db.commit()
        db.refresh(user)

    return user

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username, User.is_deleted == False).first()

