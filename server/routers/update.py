from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from schemas.update import updateRequest
from core.supabase import supabase

router = APIRouter()
security = HTTPBearer()

@router.put("/update")
def update(dados: updateRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):

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
    }

    try:
        response = (
            supabase
            .table("Tarefa")
            .update(tarefa)
            .eq("id", dados.id)
            .eq("user_fk", user_id)
            .execute()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao atualizar tarefa: {str(e)}"
        )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Tarefa não encontrada ou não pertence ao usuário"
        )

    return {
        "message": "Tarefa atualizada com sucesso",
        "tarefa": response.data
    }