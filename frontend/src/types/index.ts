export interface IAcademicProgram {
  name: string;
  degree: 'Bachelor' | 'Master' | 'PhD';
  description?: string;
  duration?: number; // Продолжительность в годах
  language?: string; // Язык обучения
  tuitionFee?: number; // Стоимость обучения для программы
  minEntScore?: number | null; // Минимальный балл ЕНТ
  hasInternship?: boolean; // Наличие практики/стажировки
  hasDoubleDegree?: boolean; // Возможность двойного диплома
  employmentRate?: number | null; // Процент трудоустройства после выпуска
}

export interface IAdmissions {
  requirements: string[];
  deadlines: string[];
  scholarships: string[];
  procedure: string;
}

export interface IInternational {
  exchangePrograms: string[];
  partners: string[];
  foreignStudentOpps: string[];
  hasExchangeProgram?: boolean;
  hasDoubleDegree?: boolean;
  requiresIELTS?: boolean;
  minIELTS?: number; // Минимальный балл IELTS (например, 5.5, 6.0)
  doubleDegreePrograms?: string[]; // Конкретные программы двойного диплома
}

export interface IUniversity {
  id: string;
  name: string;
  description: string;
  city: string;
  price: number;
  minEntScore: number;
  hasDormitory: boolean;
  hasMilitaryDept: boolean;
  rating: number;
  hasTour?: boolean;
  tourUrl?: string;
  imageUrl?: string;
  isPrivate?: boolean;
  languages?: string[];
  grantsPerYear?: number;
  academicPrograms?: IAcademicProgram[];
  admissions?: IAdmissions;
  international?: IInternational;
  mission?: string;
  history?: string;
}

export interface IAdvisorRequest {
  ent_score: number;
  profile_subjects: string;
  interests: string;
  preferred_city: string;
  career_goal: string;
}

export interface IAdvisorResponse {
  university_name: string;
  short_reason: string;
}

// Типы для API ответов бэкенда
export interface IBackendUniversity {
  id: number;
  name: string;
  description: string;
  mission_text: string;
  history: string;
  min_ent_score: number;
  logo_url: string;
  tour_url: string | null;
  city: string;
  has_dormitory: boolean;
  rating: number;
  has_tour: boolean;
  languages: string; // JSON строка или разделенная запятыми
  number_of_grants: number;
  exchange_program: boolean;
  double_degree_program: boolean;
  IELTS_sertificate: boolean;
  format: string; // "private" или "public"
  price: number;
}

export interface IBackendProgram {
  id: number;
  university_id: number;
  name: string;
  description: string;
  degree: string;
  price: number;
  duration: number;
  language: string;
  min_ent_score: number;
  internship: boolean;
  double_degree_program: boolean;
  employment: number;
}

