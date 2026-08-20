import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    """Fixture que fornece o cliente de testes da aplicação FastAPI."""
    return TestClient(app)

@pytest.fixture
def auth_headers():
    """Fixture que fornece um cabeçalho de autenticação simulado."""
    return {"Authorization": "Bearer token_de_teste_valido"}