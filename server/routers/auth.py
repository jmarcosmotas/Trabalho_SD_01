from fastapi import APIRouter, HTTPException
from schemas.auth import LoginRequest
from core.supabase import supabase

router = APIRouter()

# Faça login como usuário existente utilizando um e-mail e senha
@router.post("/login")
def login(dados: LoginRequest):

    try:
        response = supabase.auth.sign_in_with_password({
            "email": dados.email,
            "password": dados.password
        })

        return {
            "message": "Login realizado com sucesso",
            "access_token": response.session.access_token,
            "user": response.user
        }

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="E-mail ou senha inválidos"
        )

# Criar um novo usuário utilizando um e-mail e senha
@router.post("/cadastrar")
def cadastrar(dados: LoginRequest):

    try:
        response = supabase.auth.sign_up({
            "email": dados.email,
            "password": dados.password
        })

        if response.user is None:
            raise HTTPException(
                status_code=400,
                detail="Não foi possível criar o usuário"
            )

        return {"message": "Usuário cadastrado com sucesso"}

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )