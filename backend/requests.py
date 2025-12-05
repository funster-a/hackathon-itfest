from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List
from decimal import Decimal

class UniversityRequest(BaseModel):
    name: str = Field(max_length=255)
    description: str
    mission_text: Optional[str] = None
    logo_url: Optional[str] = None
    tour_url: Optional[str] = None
    city: str = Field(max_length=100)
    min_ent_score: int = Field(gt=-1, lt=141)
    has_dormitory: bool = Field(default=False)
    has_military_dept: bool = Field(default=False)
    rating: float = Field(gt=-1, lt=6)
    has_tour: bool = Field(default=False)
    history: Optional[str] = None
    languages: str
    number_of_grants: Optional[int] = None
    exchange_program: bool = Field(default=False)
    exchange_programs: Optional[str] = None  # JSON строка
    partners: Optional[str] = None  # JSON строка
    foreign_student_opps: Optional[str] = None  # JSON строка
    double_degree_program: bool = Field(default=False)
    double_degree_programs: Optional[str] = None  # JSON строка
    IELTS_sertificate: bool = Field(default=False)
    min_ielts: Optional[Decimal] = None
    format: Optional[str] = None
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
    university_id: Optional[int] = None
    deadline_date: date | None = None
    requirements_text: Optional[str] = None
    requirements: Optional[str] = None  # JSON строка
    deadlines: Optional[str] = None  # JSON строка
    scholarships: Optional[str] = None  # JSON строка
    procedure: Optional[str] = None

class AIRequest(BaseModel):
    template: str
    text: str

class AdvisorRequest(BaseModel):
    ent_score: int
    profile_subjects: str
    interests: str
    preferred_city: str
    career_goal: str

# Response models для API
class ProgramResponse(BaseModel):
    id: int
    university_id: int
    name: str
    description: Optional[str] = None
    degree: str
    price: Optional[int] = None
    duration: Optional[int] = None
    language: Optional[str] = None
    min_ent_score: Optional[int] = None
    internship: bool = False
    double_degree_program: bool = False
    employment: Optional[int] = None
    
    class Config:
        from_attributes = True

class AdmissionInfoResponse(BaseModel):
    id: int
    university_id: Optional[int] = None
    deadline_date: Optional[date] = None
    requirements_text: Optional[str] = None
    requirements: Optional[List[str]] = None
    deadlines: Optional[List[str]] = None
    scholarships: Optional[List[str]] = None
    procedure: Optional[str] = None
    
    class Config:
        from_attributes = True

class UniversityResponse(BaseModel):
    id: int
    name: str
    description: str
    mission_text: Optional[str] = None
    history: Optional[str] = None
    min_ent_score: int
    logo_url: Optional[str] = None
    tour_url: Optional[str] = None
    city: str
    has_dormitory: bool
    has_military_dept: bool = False
    rating: Decimal
    has_tour: bool = False
    languages: Optional[str] = None  # JSON строка
    number_of_grants: Optional[int] = None
    exchange_program: bool = False
    exchange_programs: Optional[str] = None  # JSON строка
    partners: Optional[str] = None  # JSON строка
    foreign_student_opps: Optional[str] = None  # JSON строка
    double_degree_program: bool = False
    double_degree_programs: Optional[str] = None  # JSON строка
    IELTS_sertificate: bool = False
    min_ielts: Optional[Decimal] = None
    format: Optional[str] = None
    price: int
    programs: Optional[List[ProgramResponse]] = None
    admission_info: Optional[AdmissionInfoResponse] = None
    
    class Config:
        from_attributes = True