from app.database import Base, engine
from app.models import material

Base.metadata.create_all(bind=engine)

print("Banco de dados inicializado")
