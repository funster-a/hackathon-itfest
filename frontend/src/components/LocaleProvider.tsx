import { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'ru' | 'kk' | 'en';

interface LocaleProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
  storageKey?: string;
}

interface LocaleProviderState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  ru: {
    // Header
    'header.title': 'ZeroHub',
    'header.catalog': 'Каталог',
    'header.compare': 'Сравнение',
    
    // HomePage
    'home.title': 'Каталог университетов',
    'filters.title': 'Фильтры',
    'filters.search': 'Поиск',
    'filters.searchPlaceholder': 'Название университета...',
    'filters.city': 'Город',
    'filters.dormitory': 'Общежитие',
    'filters.dormitoryYes': 'Есть',
    'filters.dormitoryNo': 'Нет',
    'filters.militaryDept': 'Военная кафедра',
    'filters.militaryDeptYes': 'Есть',
    'filters.militaryDeptNo': 'Нет',
    'filters.reset': 'Сбросить',
    'advisor.title': 'Абитуриент-Советник',
    'advisor.inputPlaceholder': 'Твой балл ЕНТ',
    'advisor.description': 'Введите ваш балл ЕНТ (0-140) для расчета шансов на грант',
    'results.notFound': 'Университеты не найдены',
    'results.resetFilters': 'Сбросить фильтры',
    
    // UniversityCard
    'card.addToCompare': 'Добавить к сравнению',
    'card.alreadyInCompare': 'Уже в сравнении',
    'card.chanceForGrant': 'Шанс на грант',
    'card.onlyPaid': 'Только платно',
    'card.cost': 'Стоимость:',
    'card.minScore': 'Проходной балл:',
    'card.tour': '360° Tour',
    
    // UniversityDetailsPage
    'details.back': 'Назад к каталогу',
    'details.notFound': 'Университет не найден',
    'details.backToCatalog': 'Вернуться к каталогу',
    'details.tabs.overview': 'Обзор',
    'details.tabs.details': 'Детали',
    'details.overview.title': 'Основная информация',
    'details.overview.city': 'Город:',
    'details.overview.cost': 'Стоимость обучения:',
    'details.overview.minScore': 'Проходной балл на грант:',
    'details.overview.rating': 'Рейтинг:',
    'details.details.title': 'Дополнительная информация',
    'details.details.dormitory': 'Общежитие:',
    'details.details.militaryDept': 'Военная кафедра:',
    'details.details.yes': 'Да',
    'details.details.no': 'Нет',
    'details.addToCompare': 'Добавить к сравнению',
    'details.alreadyInCompare': 'Уже в сравнении',
    'details.virtualTour': 'Виртуальный тур',
    'details.virtualTourTitle': 'Виртуальный тур:',
    'details.openInNewWindow': 'Открыть в полном окне',
    
    // ComparePage
    'compare.title': 'Сравнение университетов',
    'compare.empty': 'Добавьте вузы для сравнения',
    'compare.goToCatalog': 'Перейти к каталогу',
    'compare.backToCatalog': 'Вернуться к каталогу',
    'compare.parameter': 'Параметр',
    'compare.city': 'Город',
    'compare.cost': 'Стоимость',
    'compare.rating': 'Рейтинг',
    'compare.minScore': 'Проходной балл на грант',
    'compare.dormitory': 'Общежитие',
    'compare.militaryDept': 'Военная кафедра',
  },
  kk: {
    // Header
    'header.title': 'ZeroHub',
    'header.catalog': 'Каталог',
    'header.compare': 'Салыстыру',
    
    // HomePage
    'home.title': 'Университеттер каталогы',
    'filters.title': 'Сүзгілер',
    'filters.search': 'Іздеу',
    'filters.searchPlaceholder': 'Университет атауы...',
    'filters.city': 'Қала',
    'filters.dormitory': 'Жатақхана',
    'filters.dormitoryYes': 'Бар',
    'filters.dormitoryNo': 'Жоқ',
    'filters.militaryDept': 'Әскери кафедра',
    'filters.militaryDeptYes': 'Бар',
    'filters.militaryDeptNo': 'Жоқ',
    'filters.reset': 'Тазалау',
    'advisor.title': 'Абитуриент-Кеңесші',
    'advisor.inputPlaceholder': 'Сіздің ҰБТ баллыңыз',
    'advisor.description': 'Грантқа мүмкіндікті есептеу үшін ҰБТ баллыңызды енгізіңіз (0-140)',
    'results.notFound': 'Университеттер табылмады',
    'results.resetFilters': 'Сүзгілерді тазалау',
    
    // UniversityCard
    'card.addToCompare': 'Салыстыруға қосу',
    'card.alreadyInCompare': 'Қазірдің өзінде салыстыруда',
    'card.chanceForGrant': 'Грантқа мүмкіндік',
    'card.onlyPaid': 'Тек ақылы',
    'card.cost': 'Бағасы:',
    'card.minScore': 'Грантқа өту баллы:',
    'card.tour': '360° Тур',
    
    // UniversityDetailsPage
    'details.back': 'Каталогқа оралу',
    'details.notFound': 'Университет табылмады',
    'details.backToCatalog': 'Каталогқа оралу',
    'details.tabs.overview': 'Шолу',
    'details.tabs.details': 'Толығырақ',
    'details.overview.title': 'Негізгі ақпарат',
    'details.overview.city': 'Қала:',
    'details.overview.cost': 'Оқу бағасы:',
    'details.overview.minScore': 'Грантқа өту баллы:',
    'details.overview.rating': 'Рейтинг:',
    'details.details.title': 'Қосымша ақпарат',
    'details.details.dormitory': 'Жатақхана:',
    'details.details.militaryDept': 'Әскери кафедра:',
    'details.details.yes': 'Иә',
    'details.details.no': 'Жоқ',
    'details.addToCompare': 'Салыстыруға қосу',
    'details.alreadyInCompare': 'Қазірдің өзінде салыстыруда',
    'details.virtualTour': 'Виртуалды тур',
    'details.virtualTourTitle': 'Виртуалды тур:',
    'details.openInNewWindow': 'Толық терезеде ашу',
    
    // ComparePage
    'compare.title': 'Университеттерді салыстыру',
    'compare.empty': 'Салыстыру үшін университеттерді қосыңыз',
    'compare.goToCatalog': 'Каталогқа өту',
    'compare.backToCatalog': 'Каталогқа оралу',
    'compare.parameter': 'Параметр',
    'compare.city': 'Қала',
    'compare.cost': 'Бағасы',
    'compare.rating': 'Рейтинг',
    'compare.minScore': 'Грантқа өту баллы',
    'compare.dormitory': 'Жатақхана',
    'compare.militaryDept': 'Әскери кафедра',
  },
  en: {
    // Header
    'header.title': 'ZeroHub',
    'header.catalog': 'Catalog',
    'header.compare': 'Compare',
    
    // HomePage
    'home.title': 'University Catalog',
    'filters.title': 'Filters',
    'filters.search': 'Search',
    'filters.searchPlaceholder': 'University name...',
    'filters.city': 'City',
    'filters.dormitory': 'Dormitory',
    'filters.dormitoryYes': 'Yes',
    'filters.dormitoryNo': 'No',
    'filters.militaryDept': 'Military Department',
    'filters.militaryDeptYes': 'Yes',
    'filters.militaryDeptNo': 'No',
    'filters.reset': 'Reset',
    'advisor.title': 'Applicant Advisor',
    'advisor.inputPlaceholder': 'Your ENT Score',
    'advisor.description': 'Enter your ENT score (0-140) to calculate grant chances',
    'results.notFound': 'No universities found',
    'results.resetFilters': 'Reset filters',
    
    // UniversityCard
    'card.addToCompare': 'Add to Compare',
    'card.alreadyInCompare': 'Already in Compare',
    'card.chanceForGrant': 'Chance for Grant',
    'card.onlyPaid': 'Paid Only',
    'card.cost': 'Cost:',
    'card.minScore': 'Min Score:',
    'card.tour': '360° Tour',
    
    // UniversityDetailsPage
    'details.back': 'Back to Catalog',
    'details.notFound': 'University not found',
    'details.backToCatalog': 'Back to Catalog',
    'details.tabs.overview': 'Overview',
    'details.tabs.details': 'Details',
    'details.overview.title': 'Basic Information',
    'details.overview.city': 'City:',
    'details.overview.cost': 'Tuition Fee:',
    'details.overview.minScore': 'Min Score for Grant:',
    'details.overview.rating': 'Rating:',
    'details.details.title': 'Additional Information',
    'details.details.dormitory': 'Dormitory:',
    'details.details.militaryDept': 'Military Department:',
    'details.details.yes': 'Yes',
    'details.details.no': 'No',
    'details.addToCompare': 'Add to Compare',
    'details.alreadyInCompare': 'Already in Compare',
    'details.virtualTour': 'Virtual Tour',
    'details.virtualTourTitle': 'Virtual Tour:',
    'details.openInNewWindow': 'Open in full window',
    
    // ComparePage
    'compare.title': 'Compare Universities',
    'compare.empty': 'Add universities to compare',
    'compare.goToCatalog': 'Go to Catalog',
    'compare.backToCatalog': 'Back to Catalog',
    'compare.parameter': 'Parameter',
    'compare.city': 'City',
    'compare.cost': 'Cost',
    'compare.rating': 'Rating',
    'compare.minScore': 'Min Score for Grant',
    'compare.dormitory': 'Dormitory',
    'compare.militaryDept': 'Military Department',
  },
};

const initialState: LocaleProviderState = {
  locale: 'ru',
  setLocale: () => null,
  t: () => '',
};

const LocaleProviderContext = createContext<LocaleProviderState>(initialState);

export function LocaleProvider({
  children,
  defaultLocale = 'ru',
  storageKey = 'university-app-locale',
  ...props
}: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(
    () => (localStorage.getItem(storageKey) as Locale) || defaultLocale
  );

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  const value = {
    locale,
    setLocale: (newLocale: Locale) => {
      localStorage.setItem(storageKey, newLocale);
      setLocale(newLocale);
    },
    t,
  };

  return (
    <LocaleProviderContext.Provider {...props} value={value}>
      {children}
    </LocaleProviderContext.Provider>
  );
}

export const useLocale = () => {
  const context = useContext(LocaleProviderContext);

  if (context === undefined)
    throw new Error('useLocale must be used within a LocaleProvider');

  return context;
};

