from typing import Annotated, List
import json

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from starlette import status

from models import University, Program, AdmissionInfo
from requests import (
    UniversityRequest, ProgramRequest, AdmissionInfoRequest, AIRequest, AdvisorRequest,
    UniversityResponse, ProgramResponse, AdmissionInfoResponse
)
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

# Helper function to parse JSON fields
def parse_json_field(field: str | None) -> List[str] | None:
    if not field:
        return None
    try:
        parsed = json.loads(field)
        return parsed if isinstance(parsed, list) else None
    except:
        return None

#get requests
@router.get('/', status_code=status.HTTP_200_OK, tags=['Universities'], response_model=List[UniversityResponse])
async def read_universities(db: db_dependency):
    universities = db.query(University).all()
    result = []
    for uni in universities:
        # Получаем программы для университета
        programs = db.query(Program).filter(Program.university_id == uni.id).all()
        program_responses = [ProgramResponse.model_validate(p) for p in programs]
        
        # Получаем admission info
        admission = db.query(AdmissionInfo).filter(AdmissionInfo.university_id == uni.id).first()
        admission_response = None
        if admission:
            # Парсим JSON поля перед валидацией
            admission_dict = {
                'id': admission.id,
                'university_id': admission.university_id,
                'deadline_date': admission.deadline_date,
                'requirements_text': admission.requirements_text,
                'requirements': parse_json_field(admission.requirements) if admission.requirements else None,
                'deadlines': parse_json_field(admission.deadlines) if admission.deadlines else None,
                'scholarships': parse_json_field(admission.scholarships) if admission.scholarships else None,
                'procedure': admission.procedure,
            }
            admission_response = AdmissionInfoResponse.model_validate(admission_dict)
        
        # Создаем ответ с правильной обработкой JSON полей
        uni_dict = {
            **{k: v for k, v in uni.__dict__.items() if not k.startswith('_')},
            'programs': program_responses if program_responses else None,
            'admission_info': admission_response
        }
        result.append(UniversityResponse.model_validate(uni_dict))
    return result

@router.get('/get/{university_id}', status_code=status.HTTP_200_OK, tags=['Universities'], response_model=UniversityResponse)
async def read_university(db: db_dependency, university_id: int = Path(gt=0)):
    university_model = db.query(University).filter(University.id == university_id).first()
    if university_model is None:
        raise HTTPException(status_code=404, detail='university not found')
    
    # Получаем программы
    programs = db.query(Program).filter(Program.university_id == university_id).all()
    program_responses = [ProgramResponse.model_validate(p) for p in programs]
    
    # Получаем admission info
    admission = db.query(AdmissionInfo).filter(AdmissionInfo.university_id == university_id).first()
    admission_response = None
    if admission:
        # Парсим JSON поля перед валидацией
        admission_dict = {
            'id': admission.id,
            'university_id': admission.university_id,
            'deadline_date': admission.deadline_date,
            'requirements_text': admission.requirements_text,
            'requirements': parse_json_field(admission.requirements) if admission.requirements else None,
            'deadlines': parse_json_field(admission.deadlines) if admission.deadlines else None,
            'scholarships': parse_json_field(admission.scholarships) if admission.scholarships else None,
            'procedure': admission.procedure,
        }
        admission_response = AdmissionInfoResponse.model_validate(admission_dict)
    
    # Создаем ответ с правильной обработкой JSON полей
    uni_dict = {
        **{k: v for k, v in university_model.__dict__.items() if not k.startswith('_')},
        'programs': program_responses if program_responses else None,
        'admission_info': admission_response
    }
    return UniversityResponse.model_validate(uni_dict)

@router.get('/programs', status_code=status.HTTP_200_OK, tags=['Programs'], response_model=List[ProgramResponse])
async def read_programs(db: db_dependency):
    programs = db.query(Program).all()
    return [ProgramResponse.model_validate(p) for p in programs]

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
    
    # Обновляем все поля
    university_model.name = university_request.name
    university_model.description = university_request.description
    university_model.mission_text = university_request.mission_text
    university_model.logo_url = university_request.logo_url
    university_model.tour_url = university_request.tour_url
    university_model.city = university_request.city
    university_model.history = university_request.history
    university_model.min_ent_score = university_request.min_ent_score
    university_model.has_dormitory = university_request.has_dormitory
    university_model.has_military_dept = university_request.has_military_dept
    university_model.rating = university_request.rating
    university_model.has_tour = university_request.has_tour
    university_model.languages = university_request.languages
    university_model.number_of_grants = university_request.number_of_grants
    university_model.exchange_program = university_request.exchange_program
    university_model.exchange_programs = university_request.exchange_programs
    university_model.partners = university_request.partners
    university_model.foreign_student_opps = university_request.foreign_student_opps
    university_model.double_degree_program = university_request.double_degree_program
    university_model.double_degree_programs = university_request.double_degree_programs
    university_model.IELTS_sertificate = university_request.IELTS_sertificate
    university_model.min_ielts = university_request.min_ielts
    university_model.format = university_request.format
    university_model.price = university_request.price

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
    program_model.language = program_request.language
    program_model.min_ent_score = program_request.min_ent_score
    program_model.internship = program_request.internship
    program_model.double_degree_program = program_request.double_degree_program
    program_model.employment = program_request.employment

    db.add(program_model)
    db.commit()

@router.put('/admissions/get/{admission_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Admissions'])
async def update_admission(db: db_dependency, admission_request: AdmissionInfoRequest, admission_id: int = Path(gt=0)):
    admission_model = db.query(AdmissionInfo).filter(AdmissionInfo.id == admission_id).first()
    if admission_model is None:
        raise HTTPException(status_code=404, detail='admission not found')
    
    admission_model.university_id = admission_request.university_id
    admission_model.deadline_date = admission_request.deadline_date
    admission_model.requirements_text = admission_request.requirements_text
    admission_model.requirements = admission_request.requirements
    admission_model.deadlines = admission_request.deadlines
    admission_model.scholarships = admission_request.scholarships
    admission_model.procedure = admission_request.procedure

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
async def advisor_recommend(advisor_request: AdvisorRequest, db: db_dependency):
    """
    Рекомендация университета на основе данных абитуриента.
    Возвращает название университета и краткое обоснование.
    """
    # Получаем список доступных университетов из базы данных
    universities = db.query(University).all()
    
    # Формируем список доступных университетов для промпта
    available_universities = []
    for uni in universities:
        # Получаем программы для описания специализаций
        programs = db.query(Program).filter(Program.university_id == uni.id).limit(3).all()
        specializations = ", ".join([p.name for p in programs[:3]]) if programs else "различные направления"
        available_universities.append(f"- {uni.name} ({uni.city}) - {specializations}")
    
    universities_list = "\n".join(available_universities) if available_universities else "- KIMEP University (Алматы) - бизнес, экономика"
    
    # Формируем промпт для ИИ
    template = f"""Ты - ИИ-советник по выбору университета в Казахстане. 
Проанализируй данные абитуриента и порекомендуй подходящий университет.

ВАЖНО: Ты МОЖЕШЬ рекомендовать ТОЛЬКО университеты из следующего списка. 
НЕ придумывай другие университеты, которых нет в списке!

Доступные университеты в базе данных:
{universities_list}

Важно: Ответ должен быть в формате JSON:
{{
    "university_name": "Название университета (ТОЧНО как в списке выше)",
    "short_reason": "Краткое обоснование рекомендации (2-3 предложения)"
}}

Учти:
- Балл ЕНТ абитуриента
- Профильные предметы
- Интересы и хобби
- Предпочтения по городу
- Карьерные цели

Ответь только JSON, без дополнительного текста. Название университета должно точно совпадать с одним из списка выше."""

    text = f"""Данные абитуриента:
- Балл ЕНТ: {advisor_request.ent_score}
- Профильные предметы: {advisor_request.profile_subjects}
- Интересы/Хобби: {advisor_request.interests}
- Желаемый город: {advisor_request.preferred_city}
- Карьерная цель: {advisor_request.career_goal}

Рекомендуй наиболее подходящий университет ИЗ СПИСКА ВЫШЕ и обоснуй выбор."""

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
        
        # Проверяем, что рекомендованный университет есть в базе
        recommended_name = result.get("university_name", "")
        university_found = any(uni.name == recommended_name for uni in universities)
        
        if not university_found:
            # Если ИИ рекомендовал университет, которого нет в базе, выбираем наиболее подходящий
            # Ищем по городу или берем первый доступный
            preferred_city = advisor_request.preferred_city.lower() if advisor_request.preferred_city else ""
            matching_university = None
            
            if preferred_city:
                matching_university = next(
                    (uni for uni in universities if preferred_city in uni.city.lower() or uni.city.lower() in preferred_city),
                    None
                )
            
            if not matching_university and universities:
                matching_university = universities[0]
            
            if matching_university:
                result["university_name"] = matching_university.name
                result["short_reason"] = f"Рекомендуем {matching_university.name} на основе ваших данных. " + (result.get("short_reason", "")[:150] if result.get("short_reason") else "")
        
        # Проверяем наличие нужных полей
        if "university_name" not in result or "short_reason" not in result:
            # Если ИИ вернул неполный ответ, выбираем первый доступный университет
            fallback_uni = universities[0] if universities else None
            return {
                "university_name": fallback_uni.name if fallback_uni else "KIMEP University",
                "short_reason": ai_response[:200] if len(ai_response) > 200 else ai_response
            }
        
        return result
    except json.JSONDecodeError:
        # Если не удалось распарсить JSON, выбираем университет по городу или первый доступный
        preferred_city = advisor_request.preferred_city.lower() if advisor_request.preferred_city else ""
        matching_university = None
        
        if preferred_city and universities:
            matching_university = next(
                (uni for uni in universities if preferred_city in uni.city.lower() or uni.city.lower() in preferred_city),
                None
            )
        
        if not matching_university and universities:
            matching_university = universities[0]
        
        return {
            "university_name": matching_university.name if matching_university else "KIMEP University",
            "short_reason": ai_response[:200] if len(ai_response) > 200 else ai_response
        }
    except Exception as e:
        # В случае ошибки выбираем университет по городу или первый доступный
        preferred_city = advisor_request.preferred_city.lower() if advisor_request.preferred_city else ""
        matching_university = None
        
        if preferred_city and universities:
            matching_university = next(
                (uni for uni in universities if preferred_city in uni.city.lower() or uni.city.lower() in preferred_city),
                None
            )
        
        if not matching_university and universities:
            matching_university = universities[0]
        
        return {
            "university_name": matching_university.name if matching_university else "KIMEP University",
            "short_reason": f"Рекомендуем этот университет на основе ваших данных. Ошибка обработки: {str(e)}"
        }

