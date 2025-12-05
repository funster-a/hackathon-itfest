import api from './axios';
import type { 
  IAdvisorRequest, 
  IAdvisorResponse, 
  IUniversity, 
  IBackendUniversity,
  IBackendProgram,
  IAcademicProgram,
  IInternational
} from '../types';
import { universities as mockUniversities } from '../data/mockData';

// Адаптер для преобразования данных бэкенда в формат фронтенда
const adaptUniversity = (backendUni: IBackendUniversity, programs: IBackendProgram[] = []): IUniversity => {
  // Используем программы из ответа API, если они есть, иначе используем переданные
  const uniPrograms = backendUni.programs || programs;
  // Парсим languages (может быть JSON строка или разделенная запятыми)
  let languagesArray: string[] = [];
  try {
    if (backendUni.languages) {
      // Пробуем распарсить как JSON
      const parsed = JSON.parse(backendUni.languages);
      languagesArray = Array.isArray(parsed) ? parsed : [backendUni.languages];
    }
  } catch {
    // Если не JSON, пробуем разделить по запятым
    languagesArray = backendUni.languages ? backendUni.languages.split(',').map(l => l.trim()).filter(Boolean) : [];
  }

  // Преобразуем программы
  const academicPrograms: IAcademicProgram[] = uniPrograms
    .filter(p => p.university_id === backendUni.id)
    .map(p => ({
      name: p.name,
      degree: p.degree as 'Bachelor' | 'Master' | 'PhD',
      description: p.description || undefined,
      duration: p.duration || undefined,
      language: p.language || undefined,
      tuitionFee: p.price || undefined,
      // 0 означает отсутствие данных для числовых полей
      minEntScore: (p.min_ent_score != null && p.min_ent_score > 0) ? p.min_ent_score : null,
      // Для boolean полей: в SQLite хранится как 0/1, null означает отсутствие данных
      // Если значение 1, то true; если 0 или null, то undefined (отсутствие данных)
      // Это позволяет показывать "-" вместо крестика, если данных нет
      hasInternship: p.internship === 1 ? true : undefined,
      hasDoubleDegree: p.double_degree_program === 1 ? true : undefined,
      employmentRate: (p.employment != null && p.employment > 0) ? p.employment : null,
    }));

  // Парсим JSON поля для international
  const parseJsonField = (field: string | null | undefined): string[] => {
    if (!field) return [];
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Формируем объект international
  const international: IInternational = {
    exchangePrograms: parseJsonField(backendUni.exchange_programs), // Только если есть конкретные программы
    partners: parseJsonField(backendUni.partners),
    foreignStudentOpps: parseJsonField(backendUni.foreign_student_opps),
    hasExchangeProgram: backendUni.exchange_program,
    hasDoubleDegree: backendUni.double_degree_program,
    requiresIELTS: backendUni.IELTS_sertificate,
    minIELTS: backendUni.min_ielts ? Number(backendUni.min_ielts) : undefined,
    doubleDegreePrograms: parseJsonField(backendUni.double_degree_programs), // Только если есть конкретные программы
  };

  return {
    id: backendUni.id.toString(),
    name: backendUni.name,
    description: backendUni.description,
    city: backendUni.city,
    price: backendUni.price,
    minEntScore: backendUni.min_ent_score,
    hasDormitory: backendUni.has_dormitory,
    hasMilitaryDept: backendUni.has_military_dept || false,
    rating: Number(backendUni.rating),
    hasTour: backendUni.has_tour,
    tourUrl: backendUni.tour_url || undefined,
    imageUrl: backendUni.logo_url || undefined,
    isPrivate: backendUni.format?.toLowerCase() === 'private',
    languages: languagesArray.length > 0 ? languagesArray : undefined,
    grantsPerYear: backendUni.number_of_grants,
    academicPrograms: academicPrograms.length > 0 ? academicPrograms : undefined,
    admissions: backendUni.admission_info ? {
      requirements: backendUni.admission_info.requirements || [],
      deadlines: backendUni.admission_info.deadlines || [],
      scholarships: backendUni.admission_info.scholarships || [],
      procedure: backendUni.admission_info.procedure || '',
    } : undefined,
    international: international,
    mission: backendUni.mission_text,
    history: backendUni.history,
  };
};

// API функции
export const getUniversities = async (): Promise<IUniversity[]> => {
  try {
    const universitiesResponse = await api.get<IBackendUniversity[]>('/');
    // Программы теперь приходят вместе с университетами
    return universitiesResponse.data.map(uni => adaptUniversity(uni, []));
  } catch (error) {
    console.error('Ошибка при получении университетов:', error);
    // Fallback на mock данные
    return mockUniversities;
  }
};

export const getUniversityById = async (id: string): Promise<IUniversity | null> => {
  try {
    const universityId = parseInt(id, 10);
    if (isNaN(universityId)) {
      return null;
    }

    const universityResponse = await api.get<IBackendUniversity>(`/get/${universityId}`);
    // Программы и admission_info теперь приходят вместе с университетом
    return adaptUniversity(universityResponse.data, []);
  } catch (error) {
    console.error('Ошибка при получении университета:', error);
    // Fallback на mock данные
    return mockUniversities.find(u => u.id === id) || null;
  }
};

export const getAiRecommendation = async (data: IAdvisorRequest): Promise<IAdvisorResponse> => {
  try {
    const response = await api.post<IAdvisorResponse>('/advisor/recommend', data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении рекомендации от ИИ:', error);
    // Mock-ответ для MVP
    return new Promise((resolve) => {
      setTimeout(() => {
        // Выбираем случайный вуз из mockData
        const randomUniversity = mockUniversities[Math.floor(Math.random() * mockUniversities.length)];
        resolve({
          university_name: randomUniversity.name,
          short_reason: `ИИ рекомендует этот вуз, так как он соответствует вашим интересам (${data.interests}), профильным предметам (${data.profile_subjects}) и карьерной цели "${data.career_goal}". Университет находится в городе ${randomUniversity.city}, что соответствует вашим предпочтениям.`,
        });
      }, 1500);
    });
  }
};

