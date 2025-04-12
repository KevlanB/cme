from app.database.database import engine
from app.models import material, step, user, role
from app.database.database import Base

# Cria todas as tabelas definidas nos modelos
Base.metadata.create_all(bind=engine)
