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
  const academicPrograms: IAcademicProgram[] = programs
    .filter(p => p.university_id === backendUni.id)
    .map(p => ({
      name: p.name,
      degree: p.degree as 'Bachelor' | 'Master' | 'PhD',
      description: p.description,
      duration: p.duration,
      language: p.language,
      tuitionFee: p.price,
      minEntScore: p.min_ent_score,
      hasInternship: p.internship,
      hasDoubleDegree: p.double_degree_program,
      employmentRate: p.employment,
    }));

  // Формируем объект international
  const international: IInternational = {
    exchangePrograms: backendUni.exchange_program ? ['Программы обмена доступны'] : [],
    partners: [],
    foreignStudentOpps: [],
    hasExchangeProgram: backendUni.exchange_program,
    hasDoubleDegree: backendUni.double_degree_program,
    requiresIELTS: backendUni.IELTS_sertificate,
    doubleDegreePrograms: backendUni.double_degree_program ? ['Программы двойного диплома доступны'] : [],
  };

  return {
    id: backendUni.id.toString(),
    name: backendUni.name,
    description: backendUni.description,
    city: backendUni.city,
    price: backendUni.price,
    minEntScore: backendUni.min_ent_score,
    hasDormitory: backendUni.has_dormitory,
    hasMilitaryDept: false, // Не приходит с бэкенда, по умолчанию false
    rating: Number(backendUni.rating),
    hasTour: backendUni.has_tour,
    tourUrl: backendUni.tour_url || undefined,
    imageUrl: backendUni.logo_url || undefined,
    isPrivate: backendUni.format?.toLowerCase() === 'private',
    languages: languagesArray.length > 0 ? languagesArray : undefined,
    grantsPerYear: backendUni.number_of_grants,
    academicPrograms: academicPrograms.length > 0 ? academicPrograms : undefined,
    international: international,
    mission: backendUni.mission_text,
    history: backendUni.history,
  };
};

// API функции
export const getUniversities = async (): Promise<IUniversity[]> => {
  try {
    const [universitiesResponse, programsResponse] = await Promise.all([
      api.get<IBackendUniversity[]>('/'),
      api.get<IBackendProgram[]>('/programs').catch(() => ({ data: [] })), // Если программ нет, возвращаем пустой массив
    ]);

    const universities = universitiesResponse.data;
    const programs = programsResponse.data || [];

    return universities.map(uni => adaptUniversity(uni, programs));
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

    const [universityResponse, programsResponse] = await Promise.all([
      api.get<IBackendUniversity>(`/get/${universityId}`),
      api.get<IBackendProgram[]>('/programs').catch(() => ({ data: [] })),
    ]);

    const programs = programsResponse.data?.filter(p => p.university_id === universityId) || [];
    return adaptUniversity(universityResponse.data, programs);
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

