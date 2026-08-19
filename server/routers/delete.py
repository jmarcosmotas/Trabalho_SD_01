from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from schemas.delete import deleteRequest
from core.supabase import supabase


router = APIRouter()
security = HTTPBearer()

@router.delete("/delete")
def delete(dados: deleteRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):

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
    supabase.postgrest.auth(token)

    try:
       response = (
            supabase
            .table("tarefa")
            .delete()
            .eq("id", dados.id)
            .eq("user_fk", user_id)
            .select("id, titulo, descricao, data_limite, prioridade, status")
            .execute()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao excluir tarefa: {str(e)}"
        )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Tarefa não encontrada"
        )

    return {
        "message": "Tarefa excluída com sucesso",
        "tarefa": response.data
    }