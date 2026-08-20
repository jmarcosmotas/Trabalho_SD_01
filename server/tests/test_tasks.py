from unittest.mock import MagicMock, patch

# Testes de Autorização / Segurança 
def test_rota_protegida_sem_token(client):
    """Testa se requisições sem o cabeçalho Authorization são bloqueadas."""
    response = client.get("/read")
    assert response.status_code == 401  


def test_rota_protegida_token_invalido(client):
    """Testa a rejeição quando o Supabase não valida o token informado."""
    with patch("routers.read.supabase.auth.get_user", side_effect=Exception("Invalid token")):
        headers = {"Authorization": "Bearer token_invalido"}
        response = client.get("/read", headers=headers)
        assert response.status_code == 401
        assert response.json()["detail"] == "Token inválido ou expirado"


#Testes de Listagem
def test_listar_tarefas_sucesso(client, auth_headers):
    """Testa a listagem de tarefas retornando os registros do usuário autenticado."""
    mock_user_resp = MagicMock()
    mock_user_resp.user.id = "user-123"

    mock_db_resp = MagicMock()
    mock_db_resp.data = [
        {
            "id": 1,
            "titulo": "Estudar Sistemas Distribuídos",
            "descricao": "Finalizar testes com Pytest",
            "data_limite": "2026-08-30",
            "prioridade": "Alta",
            "status": "Pendente"
        }
    ]

    with patch("routers.read.supabase.auth.get_user", return_value=mock_user_resp), \
         patch("routers.read.supabase.postgrest.auth"), \
         patch("routers.read.supabase.table") as mock_table:

        mock_table.return_value.select.return_value.eq.return_value.execute.return_value = mock_db_resp

        response = client.get("/read", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Tarefas encontradas com sucesso"
        assert len(data["tarefas"]) == 1
        assert data["tarefas"][0]["titulo"] == "Estudar Sistemas Distribuídos"


#Teste de Criação
def test_criar_tarefa_sucesso(client, auth_headers):
    """Testa a criação de uma nova tarefa com dados válidos."""
    mock_user_resp = MagicMock()
    mock_user_resp.user.id = "user-123"

    mock_db_resp = MagicMock()
    mock_db_resp.data = [{
        "titulo": "Nova Tarefa",
        "descricao": "Descrição da tarefa de teste",
        "data_limite": "2026-08-25",
        "prioridade": "Média",
        "status": "Pendente"
    }]

    with patch("routers.create.supabase.auth.get_user", return_value=mock_user_resp), \
         patch("routers.create.supabase.postgrest.auth"), \
         patch("routers.create.supabase.table") as mock_table:

        mock_table.return_value.insert.return_value.select.return_value.execute.return_value = mock_db_resp

        payload = {
            "titulo": "Nova Tarefa",
            "descricao": "Descrição da tarefa de teste",
            "data_limite": "2026-08-25",
            "prioridade": "Média",
            "status": "Pendente"
        }

        response = client.post("/create", json=payload, headers=auth_headers)

        assert response.status_code == 200
        assert response.json()["message"] == "Tarefa criada com sucesso"
        assert response.json()["tarefa"][0]["titulo"] == "Nova Tarefa"


#Testes de Atualização
def test_atualizar_tarefa_sucesso(client, auth_headers):
    """Testa a atualização bem-sucedida dos dados de uma tarefa existente."""
    mock_user_resp = MagicMock()
    mock_user_resp.user.id = "user-123"

    mock_db_resp = MagicMock()
    mock_db_resp.data = [{
        "id": 1,
        "titulo": "Tarefa Editada",
        "descricao": "Descrição Editada",
        "data_limite": "2026-08-28",
        "prioridade": "Baixa",
        "status": "Concluída"
    }]

    with patch("routers.update.supabase.auth.get_user", return_value=mock_user_resp), \
         patch("routers.update.supabase.postgrest.auth"), \
         patch("routers.update.supabase.table") as mock_table:

        mock_table.return_value.update.return_value.eq.return_value.eq.return_value.execute.return_value = mock_db_resp

        payload = {
            "id": 1,
            "titulo": "Tarefa Editada",
            "descricao": "Descrição Editada",
            "data_limite": "2026-08-28",
            "prioridade": "Baixa",
            "status": "Concluída"
        }

        response = client.put("/update", json=payload, headers=auth_headers)

        assert response.status_code == 200
        assert response.json()["message"] == "Tarefa atualizada com sucesso"


def test_atualizar_tarefa_nao_encontrada(client, auth_headers):
    """Testa o retorno 404 quando se tenta atualizar uma tarefa inexistente ou de outro usuário."""
    mock_user_resp = MagicMock()
    mock_user_resp.user.id = "user-123"

    mock_db_resp = MagicMock()
    mock_db_resp.data = []  # Nenhuma linha afetada

    with patch("routers.update.supabase.auth.get_user", return_value=mock_user_resp), \
         patch("routers.update.supabase.postgrest.auth"), \
         patch("routers.update.supabase.table") as mock_table:

        mock_table.return_value.update.return_value.eq.return_value.eq.return_value.execute.return_value = mock_db_resp

        payload = {
            "id": 999,
            "titulo": "Tarefa Inexistente",
            "descricao": "",
            "data_limite": "2026-08-28",
            "prioridade": "Baixa",
            "status": "Pendente"
        }

        response = client.put("/update", json=payload, headers=auth_headers)

        assert response.status_code == 404
        assert response.json()["detail"] == "Tarefa não encontrada"


#Teste de Exclusão
def test_deletar_tarefa_sucesso(client, auth_headers):
    """Testa a exclusão de uma tarefa do usuário autenticado."""
    mock_user_resp = MagicMock()
    mock_user_resp.user.id = "user-123"

    mock_db_resp = MagicMock()
    mock_db_resp.data = [{"id": 1, "titulo": "Tarefa Deletada"}]

    with patch("routers.delete.supabase.auth.get_user", return_value=mock_user_resp), \
         patch("routers.delete.supabase.postgrest.auth"), \
         patch("routers.delete.supabase.table") as mock_table:

        mock_table.return_value.delete.return_value.eq.return_value.eq.return_value.select.return_value.execute.return_value = mock_db_resp

        response = client.request("DELETE", "/delete", json={"id": 1}, headers=auth_headers)

        assert response.status_code == 200
        assert response.json()["message"] == "Tarefa excluída com sucesso"