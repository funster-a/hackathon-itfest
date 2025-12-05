import { createContext, useContext, useState } from 'react';

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
    'header.favorites': 'Избранное',
    
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
    'filters.profileSubjects': 'Профильные предметы',
    'filters.selectProfiles': 'Выберите профили',
    'filters.professions': 'Профессии',
    'filters.selectProfessions': 'Выберите профессии',
    'filters.noProfessionsAvailable': 'Выберите профили для отображения профессий',
    'filters.priceRange': 'Стоимость обучения (в год)',
    'filters.degrees': 'Научные степени',
    'filters.selectDegrees': 'Выберите степени',
    'filters.selected': 'выбрано',
    'filters.reset': 'Сбросить',
    'filters.show': 'Показать фильтры',
    'filters.hide': 'Скрыть фильтры',
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
    'card.addToFavorites': 'Добавить в избранное',
    'card.removeFromFavorites': 'Удалить из избранного',
    
    // UniversityDetailsPage
    'details.back': 'Назад к каталогу',
    'details.notFound': 'Университет не найден',
    'details.backToCatalog': 'Вернуться к каталогу',
    'details.tabs.overview': 'Обзор',
    'details.tabs.details': 'Детали',
    'details.tabs.programs': 'Академические программы',
    'details.tabs.admissions': 'Поступление',
    'details.tabs.international': 'Международное сотрудничество',
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
    'details.addToFavorites': 'Добавить в избранное',
    'details.removeFromFavorites': 'Удалить из избранного',
    'details.virtualTour': 'Виртуальный тур',
    'details.virtualTourTitle': 'Виртуальный тур:',
    'details.openInNewWindow': 'Открыть в полном окне',
    'details.mission': 'Миссия:',
    'details.history': 'История:',
    'details.programs.title': 'Академические программы',
    'details.programs.bachelor': 'Бакалавриат',
    'details.programs.master': 'Магистратура',
    'details.programs.phd': 'Докторантура',
    'details.programs.addToCompare': 'Добавить программу к сравнению',
    'details.programs.alreadyInCompare': 'Уже в сравнении',
    'details.admissions.title': 'Информация о поступлении',
    'details.admissions.requirements': 'Требования',
    'details.admissions.deadlines': 'Сроки подачи',
    'details.admissions.scholarships': 'Стипендии и гранты',
    'details.admissions.procedure': 'Процедура поступления',
    'details.international.title': 'Международное сотрудничество',
    'details.international.exchange': 'Программы обмена',
    'details.international.partners': 'Партнеры',
    'details.international.foreignStudents': 'Возможности для иностранных студентов',
    
    // Toast
    'toast.addedToCompare': 'Добавлено в сравнение',
    'toast.addedToCompareDescription': 'Университет "{name}" добавлен в список сравнения',
    'toast.goToCompare': 'Перейти к сравнению',
    
    // ComparePage
    'compare.title': 'Сравнение университетов',
    'compare.empty': 'Добавьте вузы для сравнения',
    'compare.emptyUniversities': 'Добавьте университеты для сравнения',
    'compare.emptyPrograms': 'Добавьте программы для сравнения',
    'compare.emptyProgramsHint': 'Вы можете добавить программы на странице деталей университета',
    'compare.goToCatalog': 'Перейти к каталогу',
    'compare.backToCatalog': 'Вернуться к каталогу',
    'compare.tabs.universities': 'Университеты',
    'compare.tabs.programs': 'Программы',
    'compare.removeProgram': 'Удалить программу',
    'compare.programs.degree': 'Степень',
    'compare.programs.duration': 'Продолжительность',
    'compare.programs.years': 'лет',
    'compare.programs.language': 'Язык обучения',
    'compare.programs.tuitionFee': 'Стоимость обучения',
    'compare.programs.minEntScore': 'Мин. балл ЕНТ',
    'compare.programs.internship': 'Практика/стажировка',
    'compare.programs.doubleDegree': 'Двойной диплом',
    'compare.programs.employmentRate': 'Трудоустройство',
    'compare.programs.description': 'Описание',
    'compare.parameter': 'Параметр',
    'compare.city': 'Город',
    'compare.cost': 'Стоимость',
    'compare.rating': 'Рейтинг',
    'compare.minScore': 'Проходной балл на грант',
    'compare.dormitory': 'Общежитие',
    'compare.militaryDept': 'Военная кафедра',
    'compare.type': 'Тип университета',
    'compare.private': 'Частный',
    'compare.public': 'Государственный',
    'compare.languages': 'Язык обучения',
    'compare.grantsPerYear': 'Грантов в год',
    'compare.exchangeProgram': 'Программа обмена',
    'compare.doubleDegree': 'Программа двойного диплома',
    'compare.requiresIELTS': 'IELTS сертификат',
    
    // Favorites
    'favorites.title': 'Избранное',
    'favorites.empty': 'У вас пока нет избранных университетов',
    'favorites.remove': 'Удалить из избранного',
  },
  kk: {
    // Header
    'header.title': 'ZeroHub',
    'header.catalog': 'Каталог',
    'header.compare': 'Салыстыру',
    'header.favorites': 'Таңдаулылар',
    
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
    'filters.profileSubjects': 'Профильді пәндер',
    'filters.selectProfiles': 'Профильдерді таңдаңыз',
    'filters.professions': 'Мамандықтар',
    'filters.selectProfessions': 'Мамандықтарды таңдаңыз',
    'filters.noProfessionsAvailable': 'Профессияларды көрсету үшін профильдерді таңдаңыз',
    'filters.priceRange': 'Оқу құны (жылдық)',
    'filters.degrees': 'Ғылыми дәрежелер',
    'filters.selectDegrees': 'Дәрежелерді таңдаңыз',
    'filters.selected': 'таңдалды',
    'filters.reset': 'Тазалау',
    'filters.show': 'Сүзгілерді көрсету',
    'filters.hide': 'Сүзгілерді жасыру',
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
    'card.addToFavorites': 'Таңдаулыларға қосу',
    'card.removeFromFavorites': 'Таңдаулылардан алып тастау',
    'card.minScore': 'Грантқа өту баллы:',
    'card.tour': '360° Тур',
    
    // UniversityDetailsPage
    'details.back': 'Каталогқа оралу',
    'details.notFound': 'Университет табылмады',
    'details.backToCatalog': 'Каталогқа оралу',
    'details.tabs.overview': 'Шолу',
    'details.tabs.details': 'Толығырақ',
    'details.tabs.programs': 'Академиялық бағдарламалар',
    'details.tabs.admissions': 'Түсу',
    'details.tabs.international': 'Халықаралық ынтымақтастық',
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
    'details.addToFavorites': 'Таңдаулыларға қосу',
    'details.removeFromFavorites': 'Таңдаулылардан алып тастау',
    'details.virtualTour': 'Виртуалды тур',
    'details.mission': 'Миссия:',
    'details.history': 'Тарих:',
    'details.programs.title': 'Академиялық бағдарламалар',
    'details.programs.bachelor': 'Бакалавриат',
    'details.programs.master': 'Магистратура',
    'details.programs.phd': 'Докторантура',
    'details.programs.addToCompare': 'Бағдарламаны салыстыруға қосу',
    'details.programs.alreadyInCompare': 'Қазірдің өзінде салыстыруда',
    'details.admissions.title': 'Түсу туралы ақпарат',
    'details.admissions.requirements': 'Талаптар',
    'details.admissions.deadlines': 'Өтініш беру мерзімдері',
    'details.admissions.scholarships': 'Стипендиялар мен гранттар',
    'details.admissions.procedure': 'Түсу процедурасы',
    'details.international.title': 'Халықаралық ынтымақтастық',
    'details.international.exchange': 'Алмасу бағдарламалары',
    'details.international.partners': 'Серіктестер',
    'details.international.foreignStudents': 'Шетелдік студенттерге мүмкіндіктер',
    'details.virtualTourTitle': 'Виртуалды тур:',
    'details.openInNewWindow': 'Толық терезеде ашу',
    
    // Toast
    'toast.addedToCompare': 'Салыстыруға қосылды',
    'toast.addedToCompareDescription': 'Университет "{name}" салыстыру тізіміне қосылды',
    'toast.goToCompare': 'Салыстыруға өту',
    
    // ComparePage
    'compare.title': 'Университеттерді салыстыру',
    'compare.empty': 'Салыстыру үшін университеттерді қосыңыз',
    'compare.emptyUniversities': 'Салыстыру үшін университеттерді қосыңыз',
    'compare.emptyPrograms': 'Салыстыру үшін бағдарламаларды қосыңыз',
    'compare.emptyProgramsHint': 'Сіз университеттің толық ақпарат бетінде бағдарламаларды қоса аласыз',
    'compare.goToCatalog': 'Каталогқа өту',
    'compare.backToCatalog': 'Каталогқа оралу',
    'compare.tabs.universities': 'Университеттер',
    'compare.tabs.programs': 'Бағдарламалар',
    'compare.removeProgram': 'Бағдарламаны жою',
    'compare.programs.degree': 'Дәреже',
    'compare.programs.duration': 'Ұзақтығы',
    'compare.programs.years': 'жыл',
    'compare.programs.language': 'Оқыту тілі',
    'compare.programs.tuitionFee': 'Оқу ақысы',
    'compare.programs.minEntScore': 'ЕНТ мин. балл',
    'compare.programs.internship': 'Тәжірибе/стажировка',
    'compare.programs.doubleDegree': 'Қос диплом',
    'compare.programs.employmentRate': 'Жұмысқа орналасу',
    'compare.programs.description': 'Сипаттама',
    'compare.parameter': 'Параметр',
    'compare.city': 'Қала',
    'compare.cost': 'Бағасы',
    'compare.rating': 'Рейтинг',
    'compare.minScore': 'Грантқа өту баллы',
    'compare.dormitory': 'Жатақхана',
    'compare.militaryDept': 'Әскери кафедра',
    'compare.type': 'Университет түрі',
    'compare.private': 'Жеке',
    'compare.public': 'Мемлекеттік',
    'compare.languages': 'Оқыту тілі',
    'compare.grantsPerYear': 'Жылына грант',
    'compare.exchangeProgram': 'Алмасу бағдарламасы',
    'compare.doubleDegree': 'Қос диплом бағдарламасы',
    'compare.requiresIELTS': 'IELTS сертификаты',
    
    // Favorites
    'favorites.title': 'Таңдаулылар',
    'favorites.empty': 'Сізде әлі таңдаулы университеттер жоқ',
    'favorites.remove': 'Таңдаулылардан алып тастау',
  },
  en: {
    // Header
    'header.title': 'ZeroHub',
    'header.catalog': 'Catalog',
    'header.compare': 'Compare',
    'header.favorites': 'Favorites',
    
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
    'filters.profileSubjects': 'Profile Subjects',
    'filters.selectProfiles': 'Select profiles',
    'filters.professions': 'Professions',
    'filters.selectProfessions': 'Select professions',
    'filters.noProfessionsAvailable': 'Select profiles to show professions',
    'filters.priceRange': 'Tuition Fee (per year)',
    'filters.degrees': 'Academic Degrees',
    'filters.selectDegrees': 'Select degrees',
    'filters.selected': 'selected',
    'filters.reset': 'Reset',
    'filters.show': 'Show filters',
    'filters.hide': 'Hide filters',
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
    'card.addToFavorites': 'Add to Favorites',
    'card.removeFromFavorites': 'Remove from Favorites',
    
    // UniversityDetailsPage
    'details.back': 'Back to Catalog',
    'details.notFound': 'University not found',
    'details.backToCatalog': 'Back to Catalog',
    'details.tabs.overview': 'Overview',
    'details.tabs.details': 'Details',
    'details.tabs.programs': 'Academic Programs',
    'details.tabs.admissions': 'Admissions',
    'details.tabs.international': 'International Cooperation',
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
    'details.addToFavorites': 'Add to Favorites',
    'details.removeFromFavorites': 'Remove from Favorites',
    'details.virtualTour': 'Virtual Tour',
    'details.mission': 'Mission:',
    'details.history': 'History:',
    'details.programs.title': 'Academic Programs',
    'details.programs.bachelor': 'Bachelor',
    'details.programs.master': 'Master',
    'details.programs.phd': 'PhD',
    'details.programs.addToCompare': 'Add Program to Compare',
    'details.programs.alreadyInCompare': 'Already in Compare',
    'details.admissions.title': 'Admissions Information',
    'details.admissions.requirements': 'Requirements',
    'details.admissions.deadlines': 'Application Deadlines',
    'details.admissions.scholarships': 'Scholarships and Grants',
    'details.admissions.procedure': 'Admission Procedure',
    'details.international.title': 'International Cooperation',
    'details.international.exchange': 'Exchange Programs',
    'details.international.partners': 'Partners',
    'details.international.foreignStudents': 'Opportunities for Foreign Students',
    'details.virtualTourTitle': 'Virtual Tour:',
    'details.openInNewWindow': 'Open in full window',
    
    // Toast
    'toast.addedToCompare': 'Added to Compare',
    'toast.addedToCompareDescription': 'University "{name}" has been added to comparison',
    'toast.goToCompare': 'Go to Compare',
    
    // ComparePage
    'compare.title': 'Compare Universities',
    'compare.empty': 'Add universities to compare',
    'compare.emptyUniversities': 'Add universities to compare',
    'compare.emptyPrograms': 'Add programs to compare',
    'compare.emptyProgramsHint': 'You can add programs on the university details page',
    'compare.goToCatalog': 'Go to Catalog',
    'compare.backToCatalog': 'Back to Catalog',
    'compare.tabs.universities': 'Universities',
    'compare.tabs.programs': 'Programs',
    'compare.removeProgram': 'Remove Program',
    'compare.programs.degree': 'Degree',
    'compare.programs.duration': 'Duration',
    'compare.programs.years': 'years',
    'compare.programs.language': 'Language of Instruction',
    'compare.programs.tuitionFee': 'Tuition Fee',
    'compare.programs.minEntScore': 'Min. ENT Score',
    'compare.programs.internship': 'Internship',
    'compare.programs.doubleDegree': 'Double Degree',
    'compare.programs.employmentRate': 'Employment Rate',
    'compare.programs.description': 'Description',
    'compare.parameter': 'Parameter',
    'compare.city': 'City',
    'compare.cost': 'Cost',
    'compare.rating': 'Rating',
    'compare.minScore': 'Min Score for Grant',
    'compare.dormitory': 'Dormitory',
    'compare.militaryDept': 'Military Department',
    'compare.type': 'University Type',
    'compare.private': 'Private',
    'compare.public': 'Public',
    'compare.languages': 'Language of Instruction',
    'compare.grantsPerYear': 'Grants per Year',
    'compare.exchangeProgram': 'Exchange Program',
    'compare.doubleDegree': 'Double Degree Program',
    'compare.requiresIELTS': 'IELTS Certificate Required',
    
    // Favorites
    'favorites.title': 'Favorites',
    'favorites.empty': 'You have no favorite universities yet',
    'favorites.remove': 'Remove from Favorites',
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

  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[locale][key] || key;
    if (params) {
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, params[param]);
      });
    }
    return text;
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

