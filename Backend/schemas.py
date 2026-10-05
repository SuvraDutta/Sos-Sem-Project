from typing import Optional
from pydantic import BaseModel


class SOSCreate(BaseModel):
    disaster_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    accuracy: Optional[float] = None