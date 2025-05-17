from pydantic import BaseModel
from typing_extensions import Optional

from datetime import datetime

class BaseEntity(BaseModel):
    id: Optional[int]
    created_at: datetime
    updated_at: datetime
    author: Optional[str]