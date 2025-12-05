from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from starlette import status

from models import University, Program, AdmissionInfo
from requests import UniversityRequest, ProgramRequest, AdmissionInfoRequest, AIRequest, AdvisorRequest
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

@router.post('/advisor/recommend', tags=['Advisor'])
async def advisor_recommend(advisor_request: AdvisorRequest):
    """
    Рекомендация университета на основе данных абитуриента.
    Возвращает название университета и краткое обоснование.
    """
    # Формируем промпт для ИИ
    template = """Ты - ИИ-советник по выбору университета в Казахстане. 
Проанализируй данные абитуриента и порекомендуй подходящий университет.

Важно: Ответ должен быть в формате JSON:
{
    "university_name": "Название университета",
    "short_reason": "Краткое обоснование рекомендации (2-3 предложения)"
}

Доступные университеты в Казахстане:
- KIMEP University (Алматы) - бизнес, экономика, международные отношения
- Turan University (Алматы) - инженерия, бизнес, медицина, гуманитарные науки
- KBTU (Алматы) - инженерия, IT, бизнес
- Nazarbayev University (Нур-Султан) - флагманский университет, все направления
- КазНПУ имени Абая (Алматы) - педагогика, гуманитарные науки
- Al-Farabi KazNU (Алматы) - крупнейший университет, все направления

Учти:
- Балл ЕНТ абитуриента
- Профильные предметы
- Интересы и хобби
- Предпочтения по городу
- Карьерные цели

Ответь только JSON, без дополнительного текста."""

    text = f"""Данные абитуриента:
- Балл ЕНТ: {advisor_request.ent_score}
- Профильные предметы: {advisor_request.profile_subjects}
- Интересы/Хобби: {advisor_request.interests}
- Желаемый город: {advisor_request.preferred_city}
- Карьерная цель: {advisor_request.career_goal}

Рекомендуй наиболее подходящий университет и обоснуй выбор."""

    prompt = f"{template}\n\n{text}"
    
    import json
    
    try:
        ai_response = requestAI(prompt)
        
        # Парсим JSON ответ от ИИ
        # Убираем возможные markdown код блоки
        cleaned_response = ai_response.strip()
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:]
        if cleaned_response.startswith("```"):
            cleaned_response = cleaned_response[3:]
        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[:-3]
        cleaned_response = cleaned_response.strip()
        
        result = json.loads(cleaned_response)
        
        # Проверяем наличие нужных полей
        if "university_name" not in result or "short_reason" not in result:
            # Если ИИ вернул неполный ответ, формируем базовый
            return {
                "university_name": "KIMEP University",
                "short_reason": ai_response[:200] if len(ai_response) > 200 else ai_response
            }
        
        return result
    except json.JSONDecodeError:
        # Если не удалось распарсить JSON, возвращаем ответ как есть
        return {
            "university_name": "KIMEP University",
            "short_reason": ai_response[:200] if len(ai_response) > 200 else ai_response
        }
    except Exception as e:
        # В случае ошибки возвращаем базовый ответ
        return {
            "university_name": "KIMEP University",
            "short_reason": f"Рекомендуем этот университет на основе ваших данных. Ошибка обработки: {str(e)}"
        }

