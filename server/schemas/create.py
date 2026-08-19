from pydantic import BaseModel
from datetime import date
from enum import Enum


class Prioridade(str, Enum):
    baixa = "Baixa"
    media = "Média"
    alta = "Alta"


class Status(str, Enum):
    pendente = "Pendente"
    andamento = "Em andamento"
    concluida = "Concluída"


class createRequest(BaseModel):
    titulo: str
    descricao: str
    data_limite: date
    prioridade: Prioridade
    status: Status