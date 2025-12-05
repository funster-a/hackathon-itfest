from database import Base
from sqlalchemy import Integer, Column, String, ForeignKey, Date, Boolean, DECIMAL

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
    rating = Column(DECIMAL)
    has_tour = Column(Boolean)
    languages = Column(String)
    number_of_grants = Column(Integer)
    exchange_program = Column(Boolean)
    double_degree_program = Column(Boolean)
    IELTS_sertificate = Column(Boolean)
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
    deadline_date = Column(Date, nullable=True)
    requirements_text = Column(String)
    

