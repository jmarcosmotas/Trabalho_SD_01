from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from schemas.create import createRequest
from core.supabase import supabase

router = APIRouter()
security = HTTPBearer()

@router.post("/create")
def create(dados: createRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):

    token = credentials.credentials

    try:
        response_user = supabase.auth.get_user(token)
        user = response_user.user

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou expirado"
        )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Usuário não autenticado"
        )

    user_id = user.id

    tarefa = {
        "titulo": dados.titulo,
        "descricao": dados.descricao,
        "data_limite": dados.data_limite.isoformat(),
        "prioridade": dados.prioridade.value,
        "status": dados.status.value,
        "user_fk": user_id
    }

    try:
        response = (
            supabase
            .table("Tarefa")
            .insert(tarefa)
            .select()
            .execute()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao criar tarefa: {str(e)}"
        )

    return {
        "message": "Tarefa criada com sucesso",
        "tarefa": response.data
    }