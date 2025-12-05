import api from './axios';
import type { IAdvisorRequest, IAdvisorResponse } from '../types';
import { universities } from '../data/mockData';

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
        const randomUniversity = universities[Math.floor(Math.random() * universities.length)];
        resolve({
          university_name: randomUniversity.name,
          short_reason: `ИИ рекомендует этот вуз, так как он соответствует вашим интересам (${data.interests}), профильным предметам (${data.profile_subjects}) и карьерной цели "${data.career_goal}". Университет находится в городе ${randomUniversity.city}, что соответствует вашим предпочтениям.`,
        });
      }, 1500);
    });
  }
};

