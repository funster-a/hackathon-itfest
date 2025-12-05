from database import Base
from sqlalchemy import Integer, Column, String, ForeignKey, Date, Boolean, DECIMAL, Text
import json

class University(Base):
    __tablename__ = 'universities'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    mission_text = Column(String)
    history = Column(String)
    min_ent_score = Column(Integer)
    logo_url = Column(String)
    tour_url = Column(String, nullable=True)
    city = Column(String)
    has_dormitory = Column(Boolean)
    has_military_dept = Column(Boolean, default=False)  # Новое поле
    rating = Column(DECIMAL)
    has_tour = Column(Boolean)
    languages = Column(String)  # JSON строка или разделенная запятыми
    number_of_grants = Column(Integer)
    exchange_program = Column(Boolean)
    exchange_programs = Column(Text, nullable=True)  # JSON массив строк
    partners = Column(Text, nullable=True)  # JSON массив строк
    foreign_student_opps = Column(Text, nullable=True)  # JSON массив строк
    double_degree_program = Column(Boolean)
    double_degree_programs = Column(Text, nullable=True)  # JSON массив строк
    IELTS_sertificate = Column(Boolean)
    min_ielts = Column(DECIMAL, nullable=True)  # Минимальный балл IELTS
    format = Column(String)
    price = Column(Integer)
    

class Program(Base):
    __tablename__ = 'programs'
    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey('universities.id'))
    name = Column(String)
    description = Column(String)
    degree = Column(String)
    price = Column(Integer)
    duration = Column(Integer)
    language = Column(String)
    min_ent_score = Column(Integer)
    internship = Column(Boolean)
    double_degree_program = Column(Boolean)
    employment = Column(Integer)


class AdmissionInfo(Base):
    __tablename__ = 'admission_info'
    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey('universities.id'), nullable=True)  # Связь с университетом
    deadline_date = Column(Date, nullable=True)
    requirements_text = Column(String, nullable=True)
    requirements = Column(Text, nullable=True)  # JSON массив строк
    deadlines = Column(Text, nullable=True)  # JSON массив строк
    scholarships = Column(Text, nullable=True)  # JSON массив строк
    procedure = Column(Text, nullable=True)  # Текст процедуры
    

