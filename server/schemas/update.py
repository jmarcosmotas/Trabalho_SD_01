from pydantic import BaseModel
from datetime import date
from enum import Enum
from schemas.create import Prioridade, Status

class updateRequest(BaseModel):
    id: int
    titulo: str
    descricao: str
    data_limite: date
    prioridade: Prioridade
    status: Status