export interface IAcademicProgram {
  name: string;
  degree: 'Bachelor' | 'Master' | 'PhD';
  description?: string;
  duration?: number; // Продолжительность в годах
  language?: string; // Язык обучения
  tuitionFee?: number; // Стоимость обучения для программы
  minEntScore?: number; // Минимальный балл ЕНТ
  hasInternship?: boolean; // Наличие практики/стажировки
  hasDoubleDegree?: boolean; // Возможность двойного диплома
  employmentRate?: number; // Процент трудоустройства после выпуска
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

