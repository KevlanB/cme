from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import verify_password

def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = db.query(User).filter(User.username == username, User.is_deleted == False, User.active == True).first()
    if user is None or not verify_password(password, user.password):
        return None  # Se o usuário não existe ou a senha está errada, retorna None
    return user
