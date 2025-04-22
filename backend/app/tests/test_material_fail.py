from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.database.database import get_db, SessionLocal
from app import crud
from app.models.material import Material
from app.models.material_fail import MaterialFail
import pytest

client = TestClient(app)

@pytest.fixture
def db_session() -> Session:
    db = next(get_db())
    yield db
    db.rollback()
    
@pytest.fixture(autouse=True)
def clear_db(db_session: Session):
    db_session.query(MaterialFail).delete()
    db_session.query(Material).delete()
    db_session.commit()
    
@pytest.fixture
def create_material(db_session: Session):
    material = Material(name="Material de Teste", type="Tipo", serial="12345")
    db_session.add(material)
    db_session.commit()
    db_session.refresh(material)
    return material

def test_create_material_fail(db_session: Session, create_material):
    material = create_material
    response = client.post(
        f"/materials/{material.id}/fails",
        json={"description": "Falha de teste"}
    )
    assert response.status_code == 200
    assert response.json()["description"] == "Falha de teste"
    assert response.json()["material_id"] == material.id

def test_get_material_fails(db_session: Session, create_material):
    material = create_material

    client.post(
        f"/materials/{material.id}/fails",
        json={"description": "Falha de teste"}
    )

    response = client.get(f"/materials/{material.id}/fails")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["material_id"] == material.id
    assert response.json()[0]["description"] == "Falha de teste"
    

