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
  has_military_dept?: boolean;
  rating: number;
  has_tour: boolean;
  languages: string; // JSON строка или разделенная запятыми
  number_of_grants: number;
  exchange_program: boolean;
  exchange_programs?: string | null; // JSON строка
  partners?: string | null; // JSON строка
  foreign_student_opps?: string | null; // JSON строка
  double_degree_program: boolean;
  double_degree_programs?: string | null; // JSON строка
  IELTS_sertificate: boolean;
  min_ielts?: number | null; // Минимальный балл IELTS
  format: string; // "private" или "public"
  price: number;
  programs?: IBackendProgram[]; // Связанные программы
  admission_info?: IBackendAdmissionInfo | null; // Admission info
}

export interface IBackendProgram {
  id: number;
  university_id: number;
  name: string;
  description: string | null;
  degree: string;
  price: number | null;
  duration: number | null;
  language: string | null;
  min_ent_score: number | null;
  internship: boolean;
  double_degree_program: boolean;
  employment: number | null;
}

export interface IBackendAdmissionInfo {
  id: number;
  university_id: number | null;
  deadline_date: string | null;
  requirements_text: string | null;
  requirements: string[] | null;
  deadlines: string[] | null;
  scholarships: string[] | null;
  procedure: string | null;
}

