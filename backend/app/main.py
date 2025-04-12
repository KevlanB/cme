from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from app.routes import material, step, user, role, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(material.router)
app.include_router(step.router)
app.include_router(user.router)
app.include_router(role.router)
app.include_router(auth.router)

from app.models.material import Material

from app.database.database import engine, Base

Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")