from unittest.mock import MagicMock, patch

#Teste de Cadastro 
def test_cadastrar_sucesso(client):
    mock_auth_response = MagicMock()
    mock_auth_response.user = MagicMock(id="user-123", email="novo@exemplo.com")

    with patch("routers.auth.supabase.auth.sign_up", return_value=mock_auth_response):
        response = client.post(
            "/cadastrar",
            json={"email": "novo@exemplo.com", "password": "senha_segura123"}
        )

        assert response.status_code == 200
        assert response.json()["message"] == "Usuário cadastrado com sucesso"


def test_cadastrar_falha(client):
    with patch("routers.auth.supabase.auth.sign_up", side_effect=Exception("User already registered")):
        response = client.post(
            "/cadastrar",
            json={"email": "jaexiste@exemplo.com", "password": "senha_segura123"}
        )

        assert response.status_code == 400
        assert "User already registered" in response.json()["detail"]


#Testes de Login
def test_login_sucesso(client):
    mock_session = MagicMock()
    mock_session.access_token = "fake-jwt-token"

    mock_user = MagicMock()
    mock_user.id = "user-123"
    mock_user.email = "teste@exemplo.com"

    mock_auth_response = MagicMock()
    mock_auth_response.session = mock_session
    mock_auth_response.user = mock_user

    with patch("routers.auth.supabase.auth.sign_in_with_password", return_value=mock_auth_response):
        response = client.post(
            "/login",
            json={"email": "teste@exemplo.com", "password": "senha_segura123"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Login realizado com sucesso"
        assert data["access_token"] == "fake-jwt-token"


def test_login_credenciais_invalidas(client):
    with patch("routers.auth.supabase.auth.sign_in_with_password", side_effect=Exception("Invalid login credentials")):
        response = client.post(
            "/login",
            json={"email": "errado@exemplo.com", "password": "senhaerrada"}
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "E-mail ou senha inválidos"


def test_login_campos_faltando(client):
    response = client.post("/login", json={"email": "teste@exemplo.com"})
    assert response.status_code == 422