from pydantic import BaseModel, Field
from datetime import date

class UniversityRequest(BaseModel):
    name: str = Field(min_length=3)
    description: str = Field(min_length=3)
    mission_text: str
    logo_url: str
    city: str

class ProgramRequest(BaseModel):
    university_id: int
    name: str
    degree: str
    price: int
    duration: int

class AdmissionInfoRequest(BaseModel):
    deadline_date: date | None = None
    requirements_text: str
