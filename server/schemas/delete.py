from pydantic import BaseModel
from datetime import date

class deleteRequest(BaseModel):
    id: int
