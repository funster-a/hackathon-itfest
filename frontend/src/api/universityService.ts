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
  
  // Нормализуем регистр языков (первая буква заглавная, остальные строчные)
  languagesArray = languagesArray.map(lang => {
    if (!lang || !lang.trim()) return lang;
    return lang.trim().charAt(0).toUpperCase() + lang.trim().slice(1).toLowerCase();
  });

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
      // Для boolean полей: преобразуем false в undefined, чтобы показывать "-" вместо крестика
      // Это позволяет различать "нет данных" (undefined) и "данные есть, но false" (false)
      // Но так как в базе 0 означает отсутствие данных, преобразуем false в undefined
      hasInternship: p.internship === true ? true : undefined,
      hasDoubleDegree: p.double_degree_program === true ? true : undefined,
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
      requirements: Array.isArray(backendUni.admission_info.requirements) 
        ? backendUni.admission_info.requirements 
        : (backendUni.admission_info.requirements ? [backendUni.admission_info.requirements] : []),
      deadlines: Array.isArray(backendUni.admission_info.deadlines) 
        ? backendUni.admission_info.deadlines 
        : (backendUni.admission_info.deadlines ? [backendUni.admission_info.deadlines] : []),
      scholarships: Array.isArray(backendUni.admission_info.scholarships) 
        ? backendUni.admission_info.scholarships 
        : (backendUni.admission_info.scholarships ? [backendUni.admission_info.scholarships] : []),
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

export interface ICompareAiRequest {
  universities: IUniversity[];
  userGoal: string;
}

export interface ICompareAiResponse {
  winner: string;
  analysis: string;
  reasoning: string;
}

export const compareWithAi = async (data: ICompareAiRequest): Promise<ICompareAiResponse> => {
  try {
    const response = await api.post<ICompareAiResponse>('/ai/compare', data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при сравнении университетов с ИИ:', error);
    // Mock-ответ для MVP
    return new Promise((resolve) => {
      setTimeout(() => {
        const universities = data.universities;
        if (universities.length === 0) {
          resolve({
            winner: '',
            analysis: 'Не выбрано ни одного университета для сравнения.',
            reasoning: '',
          });
          return;
        }
        
        // Выбираем первый университет как победителя (можно улучшить логику)
        const winner = universities[0];
        const otherUnis = universities.slice(1);
        
        // Генерируем анализ на основе данных
        const priceComparison = universities.map(u => `${u.name}: ${u.price.toLocaleString()} ₸`).join(', ');
        const ratingComparison = universities.map(u => `${u.name}: ${u.rating}/5`).join(', ');
        
        let analysis = `## Сравнение университетов\n\n`;
        analysis += `**Стоимость обучения:** ${priceComparison}\n\n`;
        analysis += `**Рейтинг:** ${ratingComparison}\n\n`;
        
        if (data.userGoal.toLowerCase().includes('программист') || data.userGoal.toLowerCase().includes('it')) {
          analysis += `Исходя из вашей цели стать программистом, **${winner.name}** выглядит предпочтительнее благодаря сильной базе IT`;
          if (winner.price > otherUnis[0]?.price) {
            analysis += `, несмотря на более высокую цену`;
          }
          analysis += `. Университет находится в ${winner.city} и имеет рейтинг ${winner.rating}/5.`;
        } else if (data.userGoal.toLowerCase().includes('цена') || data.userGoal.toLowerCase().includes('дешев')) {
          const cheapest = universities.reduce((min, u) => u.price < min.price ? u : min);
          analysis += `Если для вас важнее всего низкая цена, то **${cheapest.name}** предлагает самое доступное обучение (${cheapest.price.toLocaleString()} ₸).`;
        } else if (data.userGoal.toLowerCase().includes('общаг') || data.userGoal.toLowerCase().includes('общежит')) {
          const withDorm = universities.filter(u => u.hasDormitory);
          if (withDorm.length > 0) {
            analysis += `Для вас важнее всего наличие общежития. **${withDorm[0].name}** предоставляет общежитие для студентов.`;
          } else {
            analysis += `К сожалению, ни один из выбранных университетов не предоставляет общежитие.`;
          }
        } else {
          analysis += `Исходя из вашей цели "${data.userGoal}", **${winner.name}** выглядит предпочтительнее благодаря сочетанию качества образования и доступности.`;
        }
        
        resolve({
          winner: winner.name,
          analysis: analysis,
          reasoning: `Рекомендация основана на анализе стоимости обучения, рейтинга, местоположения и других факторов, важных для вашей цели: "${data.userGoal}".`,
        });
      }, 2000);
    });
  }
};

export interface IChanceAnalysisRequest {
  universityId: string;
  userScore: number;
  subject: string;
}

export interface IChanceAnalysisResponse {
  chance: 'High' | 'Medium' | 'Low';
  message: string;
}

export const analyzeChance = async (data: IChanceAnalysisRequest): Promise<IChanceAnalysisResponse> => {
  try {
    const response = await api.post<IChanceAnalysisResponse>('/ai/analyze-chance', data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при анализе шансов поступления:', error);
    // Mock-ответ для MVP
    return new Promise((resolve) => {
      setTimeout(() => {
        // Получаем информацию об университете для более точного анализа
        const university = mockUniversities.find(u => u.id === data.universityId);
        const minScore = university?.minEntScore || 100;
        const scoreDiff = data.userScore - minScore;
        
        let chance: 'High' | 'Medium' | 'Low';
        let message: string;
        
        if (scoreDiff >= 20) {
          chance = 'High';
          message = `Ваш балл ${data.userScore} значительно превышает минимальный порог (${minScore}) на ${scoreDiff} баллов. У вас высокие шансы на поступление! Конкуренция на направление "${data.subject}" в этом году умеренная. Рекомендуем подать документы в первую волну.`;
        } else if (scoreDiff >= 5) {
          chance = 'Medium';
          message = `Ваш балл ${data.userScore} выше минимального порога (${minScore}) на ${scoreDiff} баллов. У вас средние шансы на поступление. Конкуренция на направление "${data.subject}" может быть высокой. Рекомендуем подстраховаться и подать документы в несколько университетов, а также рассмотреть возможность участия в дополнительных конкурсах.`;
        } else if (scoreDiff >= 0) {
          chance = 'Low';
          message = `Ваш балл ${data.userScore} близок к минимальному порогу (${minScore}). Шансы на поступление низкие, но возможны. Конкуренция на направление "${data.subject}" в этом году высокая. Рекомендуем рассмотреть альтернативные варианты или программы с более низким проходным баллом. Также стоит обратить внимание на программы с платным обучением.`;
        } else {
          chance = 'Low';
          message = `Ваш балл ${data.userScore} ниже минимального порога (${minScore}) на ${Math.abs(scoreDiff)} баллов. К сожалению, шансы на поступление очень низкие. Рекомендуем рассмотреть другие университеты с более низкими требованиями или программы с платным обучением. Также можно попробовать улучшить результаты ЕНТ и подать документы в следующем году.`;
        }
        
        resolve({
          chance,
          message,
        });
      }, 1500);
    });
  }
};

export interface IChatContext {
  type: 'university' | 'compare' | 'home';
  university?: IUniversity;
}

export const sendChatMessage = async (
  message: string,
  context: IChatContext
): Promise<string> => {
  try {
    // В будущем здесь будет реальный API вызов
    // const response = await api.post('/ai/chat', { message, context });
    // return response.data.content;
    
    // Mock-реализация для хакатона
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerMessage = message.toLowerCase();
        let response = '';
        let currentUniversity: IUniversity | undefined = context.university;

        // Поиск упоминания университета в сообщении (даже если не в контексте)
        if (!currentUniversity) {
          // Сначала ищем точное совпадение по названию
          currentUniversity = mockUniversities.find(u => {
            const uniNameLower = u.name.toLowerCase();
            return lowerMessage.includes(uniNameLower) || 
                   uniNameLower.split(' ').some(word => word.length > 3 && lowerMessage.includes(word));
          });

          // Если не нашли, используем ключевые слова
          if (!currentUniversity) {
            const universityKeywords = [
              { searchTerms: ['назарбаев', 'nazarbayev', 'nu'], matchName: 'Nazarbayev' },
              { searchTerms: ['кбту', 'kbtu', 'kazakh-british', 'british technical'], matchName: 'KBTU' },
              { searchTerms: ['кимеп', 'kimep'], matchName: 'KIMEP' },
              { searchTerms: ['туран', 'turan'], matchName: 'Turan' },
              { searchTerms: ['казнпу', 'казанпу', 'kaznpu', 'абая'], matchName: 'КазНПУ' },
              { searchTerms: ['аль-фараби', 'alfarabi', 'kaznu'], matchName: 'Al-Farabi' },
            ];

            for (const keyword of universityKeywords) {
              if (keyword.searchTerms.some(term => lowerMessage.includes(term))) {
                currentUniversity = mockUniversities.find(u => 
                  u.name.toLowerCase().includes(keyword.matchName.toLowerCase())
                );
                if (currentUniversity) break;
              }
            }
          }
        }

        // Функция для обработки вопросов о конкретном университете
        const handleUniversityQuestion = (uni: IUniversity, question: string): string => {
          const lowerQ = question.toLowerCase();

          // Вопросы о поступлении
          if (
            lowerQ.includes('поступлен') ||
            lowerQ.includes('как поступить') ||
            lowerQ.includes('требован') ||
            lowerQ.includes('документ')
          ) {
            let answer = `Для поступления в ${uni.name} требуется минимальный балл ЕНТ: ${uni.minEntScore} баллов. `;
            
            if (uni.admissions) {
              if (uni.admissions.requirements && uni.admissions.requirements.length > 0) {
                answer += `Требования: ${uni.admissions.requirements.slice(0, 3).join(', ')}. `;
              }
              if (uni.admissions.deadlines && uni.admissions.deadlines.length > 0) {
                answer += `Сроки подачи: ${uni.admissions.deadlines[0]}. `;
              }
              if (uni.admissions.procedure) {
                answer += `Процедура: ${uni.admissions.procedure}.`;
              }
            }
            
            if (uni.international?.requiresIELTS) {
              answer += ` Также требуется сертификат IELTS${uni.international.minIELTS ? ` (минимум ${uni.international.minIELTS})` : ''}.`;
            }
            
            return answer;
          }

          // Вопросы о стоимости
          if (
            lowerQ.includes('цена') ||
            lowerQ.includes('стоимость') ||
            lowerQ.includes('сколько стоит') ||
            lowerQ.includes('стоит обучение')
          ) {
            let answer = `Стоимость обучения в ${uni.name} составляет ${uni.price.toLocaleString('ru-RU')} ₸ в год.`;
            
            if (uni.academicPrograms && uni.academicPrograms.length > 0) {
              const programsWithPrice = uni.academicPrograms.filter(p => p.tuitionFee);
              if (programsWithPrice.length > 0) {
                answer += ` Стоимость может варьироваться в зависимости от программы: от ${Math.min(...programsWithPrice.map(p => p.tuitionFee!)).toLocaleString('ru-RU')} до ${Math.max(...programsWithPrice.map(p => p.tuitionFee!)).toLocaleString('ru-RU')} ₸.`;
              }
            }
            return answer;
          }

          // Вопросы об общежитии
          if (
            lowerQ.includes('общежитие') ||
            lowerQ.includes('общаг') ||
            lowerQ.includes('жилье') ||
            lowerQ.includes('проживание')
          ) {
            return uni.hasDormitory
              ? `Да, ${uni.name} предоставляет общежитие для студентов.`
              : `Нет, ${uni.name} не предоставляет общежитие.`;
          }

          // Вопросы о программах
          if (
            lowerQ.includes('программ') ||
            lowerQ.includes('специальност') ||
            lowerQ.includes('направлен')
          ) {
            if (uni.academicPrograms && uni.academicPrograms.length > 0) {
              let answer = `${uni.name} предлагает ${uni.academicPrograms.length} программ обучения. `;
              const bachelorPrograms = uni.academicPrograms.filter(p => p.degree === 'Bachelor');
              const masterPrograms = uni.academicPrograms.filter(p => p.degree === 'Master');
              const phdPrograms = uni.academicPrograms.filter(p => p.degree === 'PhD');
              
              const parts: string[] = [];
              if (bachelorPrograms.length > 0) parts.push(`${bachelorPrograms.length} бакалаврских`);
              if (masterPrograms.length > 0) parts.push(`${masterPrograms.length} магистерских`);
              if (phdPrograms.length > 0) parts.push(`${phdPrograms.length} докторских`);
              
              answer += `Включая ${parts.join(', ')} программ.`;
              return answer;
            } else {
              return `${uni.name} предлагает различные программы обучения. Подробную информацию можно найти на странице университета.`;
            }
          }

          // Вопросы о рейтинге
          if (lowerQ.includes('рейтинг') || lowerQ.includes('оценк')) {
            return `Рейтинг ${uni.name} составляет ${uni.rating}/5.0.`;
          }

          // Вопросы о городе
          if (
            lowerQ.includes('город') ||
            lowerQ.includes('где находится') ||
            lowerQ.includes('локация')
          ) {
            return `${uni.name} находится в городе ${uni.city}.`;
          }

          // Вопросы о минимальном балле
          if (
            lowerQ.includes('балл') ||
            lowerQ.includes('ент') ||
            lowerQ.includes('проходной')
          ) {
            let answer = `Минимальный балл ЕНТ для поступления в ${uni.name} составляет ${uni.minEntScore} баллов.`;
            
            if (uni.academicPrograms && uni.academicPrograms.length > 0) {
              const programsWithScore = uni.academicPrograms.filter(p => p.minEntScore);
              if (programsWithScore.length > 0) {
                const minScore = Math.min(...programsWithScore.map(p => p.minEntScore!));
                const maxScore = Math.max(...programsWithScore.map(p => p.minEntScore!));
                answer += ` Для отдельных программ требования могут варьироваться от ${minScore} до ${maxScore} баллов.`;
              }
            }
            return answer;
          }

          // Вопросы о грантах
          if (lowerQ.includes('грант') || lowerQ.includes('стипенди')) {
            if (uni.grantsPerYear) {
              return `${uni.name} предоставляет ${uni.grantsPerYear} грантов в год.`;
            } else {
              return `Информацию о грантах и стипендиях в ${uni.name} можно уточнить в приемной комиссии.`;
            }
          }

          // Общие вопросы о университете
          return `О ${uni.name}: это ${uni.isPrivate ? 'частный' : 'государственный'} университет в ${uni.city} с рейтингом ${uni.rating}/5. Стоимость обучения: ${uni.price.toLocaleString('ru-RU')} ₸/год. Минимальный балл ЕНТ: ${uni.minEntScore}. ${uni.hasDormitory ? 'Предоставляет общежитие.' : 'Не предоставляет общежитие.'} Чем еще могу помочь?`;
        };

        // Обработка общих вопросов
        if (
          lowerMessage.includes('как ты работаешь') ||
          lowerMessage.includes('что ты умеешь') ||
          lowerMessage.includes('твои возможности')
        ) {
          response = 'Я AI Advisor — ваш помощник в выборе университета. Я могу:\n\n' +
            '• Ответить на вопросы о конкретных университетах (стоимость, программы, поступление, общежитие)\n' +
            '• Помочь с выбором университета на основе ваших критериев\n' +
            '• Сравнить университеты по различным параметрам\n' +
            '• Рассказать о требованиях к поступлению и документах\n' +
            '• Предоставить информацию о грантах и стипендиях\n\n' +
            'Просто задайте вопрос или упомяните название университета, и я помогу!';
        }
        // Вопросы об интеллекте
        else if (
          lowerMessage.includes('насколько ты умен') ||
          lowerMessage.includes('насколько ты умный') ||
          lowerMessage.includes('ты умный')
        ) {
          response = 'Я специализированный AI-ассистент для работы с информацией об университетах Казахстана. ' +
            'Я могу анализировать данные о более чем 20 университетах, их программах, стоимости, требованиях к поступлению и многом другом. ' +
            'Моя задача — помочь вам найти подходящий университет и ответить на все ваши вопросы. ' +
            'Попробуйте спросить меня о конкретном университете или задать вопрос о поступлении!';
        }
        // Вопросы о помощи с выбором
        else if (
          lowerMessage.includes('помоги с выбором') ||
          lowerMessage.includes('помоги выбрать') ||
          lowerMessage.includes('какой университет') ||
          lowerMessage.includes('посоветуй университет')
        ) {
          response = 'Чтобы помочь вам с выбором университета, мне нужна дополнительная информация:\n\n' +
            '• Какой у вас балл ЕНТ?\n' +
            '• Какие профильные предметы вас интересуют?\n' +
            '• В каком городе вы хотели бы учиться?\n' +
            '• Какая у вас карьерная цель?\n' +
            '• Важен ли вам бюджет (стоимость обучения)?\n' +
            '• Нужно ли общежитие?\n\n' +
            'Также вы можете использовать функцию "AI Advisor" на главной странице для получения персонализированных рекомендаций. ' +
            'Или задайте мне конкретный вопрос, например: "Сколько стоит обучение в КБТУ?" или "Как поступить в Назарбаев Университет?"';
        }
        // Если упомянут конкретный университет
        else if (currentUniversity) {
          response = handleUniversityQuestion(currentUniversity, message);
        }
        // Если есть контекст университета
        else if (context.type === 'university' && context.university) {
          response = handleUniversityQuestion(context.university, message);
        }
        // Контекст сравнения
        else if (context.type === 'compare') {
          if (
            lowerMessage.includes('поступлен') ||
            lowerMessage.includes('стоимость') ||
            lowerMessage.includes('цена') ||
            lowerMessage.includes('балл') ||
            lowerMessage.includes('программ')
          ) {
            // Пытаемся найти университет в сообщении
            if (currentUniversity) {
              response = handleUniversityQuestion(currentUniversity, message);
            } else {
              response = 'Вы находитесь на странице сравнения. Чтобы получить информацию о конкретном университете, упомяните его название в вопросе. Например: "Сколько стоит обучение в КБТУ?" или "Как поступить в Назарбаев Университет?"';
            }
          } else {
            response = 'Вы находитесь на странице сравнения университетов. Я могу помочь с анализом выбранных университетов, сравнением их характеристик и рекомендациями. ' +
              'Задайте конкретный вопрос, например: "Сколько стоит обучение в КБТУ?" или "Как поступить в Назарбаев Университет?"';
          }
        }
        // Общий контекст
        else {
          response = 'Я могу помочь вам с выбором университета, ответить на вопросы о программах, стоимости, требованиях к поступлению и многом другом. ' +
            'Упомяните название университета в вашем вопросе, например: "Сколько стоит обучение в КБТУ?" или "Как поступить в Назарбаев Университет?" ' +
            'Также могу рассказать о том, как я работаю, или помочь с выбором университета.';
        }

        resolve(response);
      }, 1000 + Math.random() * 500); // Задержка 1-1.5 секунды
    });
  } catch (error) {
    console.error('Ошибка при отправке сообщения в чат:', error);
    throw error;
  }
};

