from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from starlette import status

from models import University, Program, AdmissionInfo
from requests import UniversityRequest, ProgramRequest, AdmissionInfoRequest, AIRequest
from database import SessionLocal
from groq import requestAI

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

#get requests
@router.get('/', status_code=status.HTTP_200_OK, tags=['Universities'])
async def read_universities(db: db_dependency):
    return db.query(University).all()

@router.get('/get/{university_id}', status_code=status.HTTP_200_OK, tags=['Universities'])
async def read_university(db: db_dependency, university_id: int = Path(gt=0)):
    university_model = db.query(University).filter(University.id == university_id).first()
    if university_model is not None:
        return university_model
    raise HTTPException(status_code=404, detail='university not found')

@router.get('/programs', status_code=status.HTTP_200_OK, tags=['Programs'])
async def read_programs(db: db_dependency):
    return db.query(Program).all()

@router.get('/programs/get/{program_id}', status_code=status.HTTP_200_OK, tags=['Programs'])
async def read_program(db: db_dependency, program_id: int = Path(gt=0)):
    program_model = db.query(Program).filter(Program.id == program_id).first()
    if program_model is not None:
        return program_model
    raise HTTPException(status_code=404, detail='programs not found')

@router.get('/admissions', status_code=status.HTTP_200_OK, tags=['Admissions'])
async def read_admissions(db: db_dependency):
    return db.query(AdmissionInfo).all()

@router.get('/admissions/get/{admission_id}', status_code=status.HTTP_200_OK, tags=['Admissions'])
async def read_admission(db: db_dependency, admission_id: int = Path(gt=0)):
    admission_model = db.query(AdmissionInfo).filter(AdmissionInfo.id == admission_id).first()
    if admission_model is not None:
        return admission_model
    raise HTTPException(status_code=404, detail='Todo not found')


#post requests
@router.post('/', status_code=status.HTTP_201_CREATED, tags=['Universities'])
async def create_university(db: db_dependency, university_request: UniversityRequest):
    university_model = University(**university_request.model_dump())
    db.add(university_model)
    db.commit()

@router.post('/programs', status_code=status.HTTP_201_CREATED, tags=['Programs'])
async def create_program(db: db_dependency, program_request: ProgramRequest):
    program_model = Program(**program_request.model_dump())
    db.add(program_model)
    db.commit()

@router.post('/admission', status_code=status.HTTP_201_CREATED, tags=['Admissions'])
async def create_admission(db: db_dependency, admission_request: AdmissionInfoRequest):
    admission_model = AdmissionInfo(**admission_request.model_dump())
    db.add(admission_model)
    db.commit()

#put requests
@router.put('/get/{university_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Universities'])
async def update_university(db: db_dependency, university_request: UniversityRequest, university_id: int = Path(gt=0)):
    university_model = db.query(University).filter(University.id == university_id).first()
    if university_model is None:
        raise HTTPException(status_code=404, detail='university not found')
    university_model.name = university_request.name
    university_model.description  = university_request.description
    university_model.mission_text = university_request.mission_text
    university_model.logo_url = university_request.logo_url
    university_model.tour_url = university_request.tour_url
    university_model.city = university_request.city

    db.add(university_model)
    db.commit()

@router.put('/programs/get/{program_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Programs'])
async def update_program(db: db_dependency, program_request: ProgramRequest, program_id: int = Path(gt=0)):
    program_model = db.query(Program).filter(Program.id == program_id).first()
    if program_model is None:
        raise HTTPException(status_code=404, detail='program not found')
    program_model.university_id = program_request.university_id
    program_model.name  = program_request.name
    program_model.degree = program_request.degree
    program_model.price = program_request.price
    program_model.duration = program_request.duration

    db.add(program_model)
    db.commit()

@router.put('/admissions/get/{admission_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Admissions'])
async def update_admission(db: db_dependency, admission_request: AdmissionInfoRequest, admission_id: int = Path(gt=0)):
    admission_model = db.query(AdmissionInfo).filter(AdmissionInfo.id == admission_id).first()
    if admission_model is None:
        raise HTTPException(status_code=404, detail='admission not found')
    admission_model.deadline_date = admission_request.deadline_date
    admission_model.requirements_text  = admission_request.requirements_text

    db.add(admission_model)
    db.commit()

#delete requests
@router.delete('/{university_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Universities'])
async def delete_university(db: db_dependency, university_id: int = Path(gt=0)):
    university_model = db.query(University).filter(University.id == university_id).first()
    if university_model is None:
        raise HTTPException(status_code=404, detail='university not found')
    db.query(University).filter(University.id == university_id).delete()
    db.commit()

@router.delete('/programs/get/{program_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Programs'])
async def delete_program(db: db_dependency, program_id: int = Path(gt=0)):
    program_model = db.query(Program).filter(Program.id == program_id).first()
    if program_model is None:
        raise HTTPException(status_code=404, detail='university not found')
    db.query(Program).filter(Program.id == program_id).delete()
    db.commit()

@router.delete('/admissions/get/{admission_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Admissions'])
async def delete_admission(db: db_dependency, admission_id: int = Path(gt=0)):
    admission_model = db.query(AdmissionInfo).filter(AdmissionInfo.id == admission_id).first()
    if admission_model is None:
        raise HTTPException(status_code=404, detail='university not found')
    db.query(AdmissionInfo).filter(AdmissionInfo.id == admission_id).delete()
    db.commit()


#ai
@router.post('/ai', tags=['Ai'])
async def request_ai(ai_request: AIRequest):
    data = ai_request.model_dump()
    prompt = f"{data['template']}\n{data['text']}"
    response = requestAI(prompt)
    return response

