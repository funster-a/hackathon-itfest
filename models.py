from database import Base
from sqlalchemy import Integer, Column, String, ForeignKey, Date

class University(Base):
    __tablename__ = 'universities'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    mission_text = Column(String)
    logo_url = Column(String)
    city = Column(String)

class Program(Base):
    __tablename__ = 'programs'
    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey('universities.id'))
    name = Column(String)
    degree = Column(String)
    price = Column(Integer)
    duration = Column(Integer)

class AdmissionInfo(Base):
    __tablename__ = 'admission_info'
    id = Column(Integer, primary_key=True, index=True)
    deadline_date = Column(Date, nullable=True)
    requirements_text = Column(String)
    

