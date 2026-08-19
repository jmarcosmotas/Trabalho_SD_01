from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.supabase import supabase

router = APIRouter()
security = HTTPBearer()

@router.get("/read")
def read(credentials: HTTPAuthorizationCredentials = Depends(security)):

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
            .select("id, titulo, descricao, data_limite, prioridade, status")
            .eq("user_fk", user_id)
            .execute()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar tarefas: {str(e)}"
        )
    return {
        "message": "Tarefas encontradas com sucesso",
        "tarefas": response.data
    }