from pydantic import BaseModel, Field
from datetime import date

class UniversityRequest(BaseModel):
    name: str = Field(max_length=255)
    description: str
    mission_text: str
    logo_url: str
    tour_url: str
    city: str = Field(max_length=100)
    min_ent_score: int = Field(gt=-1, lt=141)
    has_dormitory: bool = Field(default=False)
    rating: float = Field(gt=-1, lt=6)
    has_tour: bool = Field(default=False)
    history: str
    languages: str
    number_of_grants: int
    exchange_program: bool = Field(default=False)
    double_degree_program: bool = Field(default=False)
    IELTS_sertificate: bool = Field(default=False)
    format: str
    price: int
    

class ProgramRequest(BaseModel):
    university_id: int
    name: str
    description: str
    degree: str
    price: int
    duration: int
    language: str
    min_ent_score: int
    internship: bool = Field(default=False)
    double_degree_program: bool = Field(default=False)
    employment: int

class AdmissionInfoRequest(BaseModel):
    deadline_date: date | None = None
    requirements_text: str

class AIRequest(BaseModel):
    template: str
    text: str

class AdvisorRequest(BaseModel):
    ent_score: int
    profile_subjects: str
    interests: str
    preferred_city: str
    career_goal: str