import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Search, Filter, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';
import { useLocale } from '@/components/LocaleProvider';
import UniversityCard from '@/components/UniversityCard';
import AdvisorModal from '@/components/AdvisorModal';
import { getAiRecommendation } from '../api/universityService';
import type { IAdvisorRequest, IAdvisorResponse } from '../types';

const ITEMS_PER_PAGE = 9;

// Профильные предметы
const PROFILE_SUBJECTS = [
  'Инф-мат',
  'Хим-био',
  'Физ-мат',
  'Био-хим',
  'Гео-био',
  'Матем-геогр',
  'Ист-прав',
  'Яз-лит',
  'Общ-чел',
];

// Профессии по профилям
const PROFESSIONS_BY_PROFILE: Record<string, string[]> = {
  'Инф-мат': [
    'Программирование',
    'Веб-разработка',
    'Кибербезопасность',
    'Искусственный интеллект',
    'Data Science',
    'Системное администрирование',
  ],
  'Хим-био': [
    'Биотехнологии',
    'Фармацевтика',
    'Медицинская химия',
    'Биохимия',
    'Молекулярная биология',
    'Генетика',
  ],
  'Физ-мат': [
    'Физика',
    'Математика',
    'Прикладная математика',
    'Теоретическая физика',
    'Инженерная физика',
  ],
  'Био-хим': [
    'Биология',
    'Химия',
    'Биохимия',
    'Экология',
    'Биофизика',
  ],
  'Гео-био': [
    'География',
    'Биология',
    'Экология',
    'Геология',
    'Гидрология',
  ],
  'Матем-геогр': [
    'Математика',
    'География',
    'Геоинформатика',
    'Картография',
  ],
  'Ист-прав': [
    'История',
    'Право',
    'Политология',
    'Международные отношения',
    'Юриспруденция',
  ],
  'Яз-лит': [
    'Лингвистика',
    'Литература',
    'Переводческое дело',
    'Журналистика',
    'Филология',
  ],
  'Общ-чел': [
    'Психология',
    'Социология',
    'Философия',
    'Педагогика',
    'Социальная работа',
  ],
};

const DEGREES = [
  'Бакалавриат',
  'Магистратура',
  'Докторантура',
];

// Минимальная и максимальная стоимость из данных
const getPriceRange = (universitiesList: typeof universities) => {
  const prices = universitiesList.map((u) => u.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  // Увеличиваем максимальное значение для возможности фильтрации выше текущего максимума
  return {
    min: Math.max(0, min - 500000), // Округляем вниз до 500k
    max: Math.max(max, 10000000), // Минимум 10 млн, но может быть больше
  };
};

const HomePage = () => {
  const { userEntScore, setEntScore } = useCompareStore();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [entScoreInput, setEntScoreInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hasDormitory, setHasDormitory] = useState<boolean>(false);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const [professionsOpen, setProfessionsOpen] = useState<boolean>(false);
  const [degreesOpen, setDegreesOpen] = useState<boolean>(false);
  const [languagesOpen, setLanguagesOpen] = useState<boolean>(false);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState<boolean>(false);
  const [advisorRecommendation, setAdvisorRecommendation] = useState<IAdvisorResponse | null>(null);

  // Инициализация диапазона цен
  useEffect(() => {
    const range = getPriceRange(universities);
    setPriceRange([range.min, range.max]);
  }, []);

  // Получаем уникальные города
  const cities = useMemo(() => {
    const citySet = new Set(universities.map((u) => u.city));
    return Array.from(citySet);
  }, []);

  // Получаем уникальные языки
  const languages = useMemo(() => {
    const languageSet = new Set<string>();
    universities.forEach((u) => {
      if (u.languages) {
        u.languages.forEach((lang) => languageSet.add(lang));
      }
    });
    return Array.from(languageSet).sort();
  }, []);

  // Вычисляем диапазон цен один раз
  const priceRangeData = useMemo(() => getPriceRange(universities), []);

  // Кешируем нормализованный поисковый запрос
  const normalizedSearchQuery = useMemo(() => 
    searchQuery.toLowerCase().trim(), 
    [searchQuery]
  );

  // Создаем Set для быстрой проверки языков
  // Оптимизация: создаем Set только если есть выбранные языки
  const selectedLanguagesSet = useMemo(() => {
    if (selectedLanguages.length === 0) {
      return new Set<string>();
    }
    return new Set(selectedLanguages);
  }, [selectedLanguages]);

  const handleEntScoreChange = useCallback((value: string) => {
    setEntScoreInput(value);
    const numValue = value === '' ? null : Number(value);
    if (numValue === null || (!isNaN(numValue) && numValue >= 0 && numValue <= 140)) {
      setEntScore(numValue);
    }
  }, [setEntScore]);

  // Фильтрация университетов (оптимизированная версия)
  const filteredUniversities = useMemo(() => {
    const hasLanguageFilter = selectedLanguagesSet.size > 0;
    
    // Ранний выход если нет активных фильтров
    if (!normalizedSearchQuery && !selectedCity && !hasDormitory && 
        !hasLanguageFilter && 
        priceRange[0] === priceRangeData.min && 
        priceRange[1] === priceRangeData.max) {
      return universities;
    }

    return universities.filter((university) => {
      // Поиск по названию (используем кешированное значение)
      if (normalizedSearchQuery && !university.name.toLowerCase().includes(normalizedSearchQuery)) {
        return false;
      }
      // Фильтр по городу
      if (selectedCity && university.city !== selectedCity) {
        return false;
      }
      // Фильтр по общежитию (применяется только если выбрано)
      if (hasDormitory && !university.hasDormitory) {
        return false;
      }
      // Фильтр по стоимости обучения
      if (university.price < priceRange[0] || university.price > priceRange[1]) {
        return false;
      }
      // Фильтр по языкам (оптимизированная проверка)
      if (hasLanguageFilter) {
        // Если у университета нет языков, сразу исключаем
        if (!university.languages || university.languages.length === 0) {
          return false;
        }
        // Проверяем пересечение языков (используем Set для O(1) проверки)
        // .some() уже делает ранний выход при первом совпадении
        if (!university.languages.some(lang => selectedLanguagesSet.has(lang))) {
          return false;
        }
      }
      return true;
    });
  }, [normalizedSearchQuery, selectedCity, hasDormitory, priceRange, selectedLanguagesSet, priceRangeData]);

  // Сброс страницы при изменении фильтров
  // Используем selectedLanguagesSet.size вместо массива для лучшей производительности
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, hasDormitory, selectedProfiles.length, selectedProfessions.length, selectedDegrees.length, selectedLanguagesSet.size, priceRange]);

  // Вычисление пагинации
  const totalPages = useMemo(() => 
    Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE),
    [filteredUniversities.length]
  );
  
  const paginatedUniversities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUniversities.slice(startIndex, endIndex);
  }, [filteredUniversities, currentPage]);

  // Мемоизируем вычисление страниц для пагинации
  const paginationPages = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pages.push(1);
      
      if (currentPage <= 3) {
        // Если мы в начале
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Если мы в конце
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Если мы в середине
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [totalPages, currentPage]);

  // Функция для переключения страницы с прокруткой вверх
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCity(null);
    setHasDormitory(false);
    setSelectedProfiles([]);
    setSelectedProfessions([]);
    setSelectedDegrees([]);
    setSelectedLanguages([]);
    setPriceRange([priceRangeData.min, priceRangeData.max]);
  }, [priceRangeData]);

  const hasActiveFilters = useMemo(() => 
    selectedCity !== null || 
    hasDormitory || 
    selectedProfiles.length > 0 || 
    selectedProfessions.length > 0 ||
    selectedDegrees.length > 0 ||
    selectedLanguagesSet.size > 0 ||
    priceRange[0] !== priceRangeData.min ||
    priceRange[1] !== priceRangeData.max,
    [selectedCity, hasDormitory, selectedProfiles.length, selectedProfessions.length, selectedDegrees.length, selectedLanguagesSet.size, priceRange, priceRangeData]
  );

  const toggleProfile = useCallback((profile: string) => {
    setSelectedProfiles((prev) => {
      const newProfiles = prev.includes(profile)
        ? prev.filter((p) => p !== profile)
        : [...prev, profile];
      
      // Удаляем профессии, которые больше не относятся к выбранным профилям
      if (!newProfiles.includes(profile)) {
        const professionsToRemove = PROFESSIONS_BY_PROFILE[profile] || [];
        setSelectedProfessions((prevProfs) =>
          prevProfs.filter((prof) => !professionsToRemove.includes(prof))
        );
      }
      
      return newProfiles;
    });
  }, []);

  const toggleProfession = useCallback((profession: string) => {
    setSelectedProfessions((prev) =>
      prev.includes(profession)
        ? prev.filter((p) => p !== profession)
        : [...prev, profession]
    );
  }, []);

  // Получаем доступные профессии для выбранных профилей
  const availableProfessions = useMemo(() => {
    const professions = new Set<string>();
    selectedProfiles.forEach((profile) => {
      (PROFESSIONS_BY_PROFILE[profile] || []).forEach((prof) => professions.add(prof));
    });
    return Array.from(professions).sort();
  }, [selectedProfiles]);

  const toggleDegree = useCallback((degree: string) => {
    setSelectedDegrees((prev) =>
      prev.includes(degree)
        ? prev.filter((d) => d !== degree)
        : [...prev, degree]
    );
  }, []);

  const toggleLanguage = useCallback((language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  }, []);

  const handleAdvisorRecommend = useCallback(async (data: IAdvisorRequest) => {
    try {
      const response = await getAiRecommendation(data);
      setAdvisorRecommendation(response);
      setIsAdvisorModalOpen(false);
    } catch (error) {
      console.error('Ошибка при получении рекомендации:', error);
    }
  }, []);

  const findUniversityByName = useCallback((name: string) => {
    // Нечеткий поиск по названию
    const normalizedName = name.toLowerCase().trim();
    return universities.find((u) => 
      u.name.toLowerCase().includes(normalizedName) || 
      normalizedName.includes(u.name.toLowerCase())
    );
  }, []);

  const handleGoToUniversity = useCallback(() => {
    if (advisorRecommendation) {
      const university = findUniversityByName(advisorRecommendation.university_name);
      if (university) {
        navigate(`/university/${university.id}`);
      } else {
        // Если не нашли, попробуем найти по частичному совпадению
        const partialMatch = universities.find((u) => 
          advisorRecommendation.university_name.toLowerCase().includes(u.name.toLowerCase().substring(0, 10)) ||
          u.name.toLowerCase().includes(advisorRecommendation.university_name.toLowerCase().substring(0, 10))
        );
        if (partialMatch) {
          navigate(`/university/${partialMatch.id}`);
        }
      }
    }
  }, [advisorRecommendation, findUniversityByName, navigate]);

  const toggleFiltersVisible = useCallback(() => {
    setFiltersVisible(prev => !prev);
  }, []);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(prevCity => prevCity === city ? null : city);
  }, []);

  const handlePriceRangeChange = useCallback((value: number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setPriceRange([value[0], value[1]]);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{t('home.title')}</h1>

      {/* Блок фильтров и советника */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Фильтры - слева */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between h-8">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t('filters.title')}
              </h2>
              <div className="h-8 flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('filters.reset')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFiltersVisible}
                  className="h-8"
                  aria-label={filtersVisible ? t('filters.hide') : t('filters.show')}
                >
                  {filtersVisible ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Поиск - всегда видим */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('filters.search')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('filters.searchPlaceholder')}
                  className="pl-9"
                />
              </div>
            </div>

            {filtersVisible && (
              <>
                <Separator />

            {/* Фильтр по городу */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('filters.city')}</label>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <Button
                    key={city}
                    variant={selectedCity === city ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCityChange(city)}
                    className="text-sm"
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Фильтр по профильным предметам и профессиям в одной строке */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Профильные предметы */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('filters.profileSubjects')}</label>
                <DropdownMenu 
                  modal={false} 
                  open={profilesOpen} 
                  onOpenChange={setProfilesOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedProfiles.length > 0
                        ? `${selectedProfiles.length} ${t('filters.selected')}`
                        : t('filters.selectProfiles')}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 max-h-[300px] overflow-y-auto"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuLabel>{t('filters.profileSubjects')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {PROFILE_SUBJECTS.map((profile) => (
                      <DropdownMenuCheckboxItem
                        key={profile}
                        checked={selectedProfiles.includes(profile)}
                        onCheckedChange={() => toggleProfile(profile)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {profile}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Профессии (показывается только если выбраны профили) */}
              {selectedProfiles.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('filters.professions')}</label>
                  <DropdownMenu 
                    modal={false} 
                    open={professionsOpen} 
                    onOpenChange={setProfessionsOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedProfessions.length > 0
                          ? `${selectedProfessions.length} ${t('filters.selected')}`
                          : t('filters.selectProfessions')}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-56 max-h-[300px] overflow-y-auto"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <DropdownMenuLabel>{t('filters.professions')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {availableProfessions.length > 0 ? (
                        availableProfessions.map((profession) => (
                          <DropdownMenuCheckboxItem
                            key={profession}
                            checked={selectedProfessions.includes(profession)}
                            onCheckedChange={() => toggleProfession(profession)}
                            onSelect={(e) => e.preventDefault()}
                          >
                            {profession}
                          </DropdownMenuCheckboxItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          {t('filters.noProfessionsAvailable')}
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <Separator />

            {/* Фильтр по стоимости обучения */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('filters.priceRange')}</label>
              <div className="px-2">
                  <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  min={priceRangeData.min}
                  max={priceRangeData.max}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{priceRange[0].toLocaleString()} ₸</span>
                  <span>{priceRange[1].toLocaleString()} ₸</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Фильтр по научным степеням и языкам в одной строке */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Научные степени */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('filters.degrees')}</label>
                <DropdownMenu 
                  modal={false} 
                  open={degreesOpen} 
                  onOpenChange={setDegreesOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedDegrees.length > 0
                        ? `${selectedDegrees.length} ${t('filters.selected')}`
                        : t('filters.selectDegrees')}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuLabel>{t('filters.degrees')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {DEGREES.map((degree) => (
                      <DropdownMenuCheckboxItem
                        key={degree}
                        checked={selectedDegrees.includes(degree)}
                        onCheckedChange={() => toggleDegree(degree)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {degree}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Языки обучения */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('filters.languages')}</label>
                <DropdownMenu 
                  modal={false} 
                  open={languagesOpen} 
                  onOpenChange={setLanguagesOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedLanguages.length > 0
                        ? `${selectedLanguages.length} ${t('filters.selected')}`
                        : t('filters.selectLanguages')}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuLabel>{t('filters.languages')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {languages.map((language) => (
                      <DropdownMenuCheckboxItem
                        key={language}
                        checked={selectedLanguages.includes(language)}
                        onCheckedChange={() => toggleLanguage(language)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {language}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Separator />

            {/* Фильтр по общежитию - чекбокс */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dormitory"
                checked={hasDormitory}
                onCheckedChange={(checked) => setHasDormitory(checked === true)}
              />
              <label
                htmlFor="dormitory"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t('filters.dormitory')}
              </label>
            </div>

              </>
            )}
          </CardContent>
        </Card>

        {/* Абитуриент-Советник - справа */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold p-0.5">{t('advisor.title')}</h2>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('advisor.description')}</label>
                <Input
                  type="number"
                  value={entScoreInput}
                  onChange={(e) => handleEntScoreChange(e.target.value)}
                  min="0"
                  max="140"
                  placeholder={t('advisor.inputPlaceholder')}
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => setIsAdvisorModalOpen(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Подобрать с ИИ
              </Button>

              {/* Результат ИИ-Советника */}
              {advisorRecommendation && (
                <>
                  <Separator />
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        Твой идеальный выбор: {advisorRecommendation.university_name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {advisorRecommendation.short_reason}
                      </p>
                    </div>
                    <Button
                      onClick={handleGoToUniversity}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Перейти к университету
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Результаты */}
      <div className="flex flex-col gap-4">
        {filteredUniversities.length > 0 ? (
          <>
            {paginatedUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
                userEntScore={userEntScore}
              />
            ))}
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {/* Кнопка Previous */}
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                    )}

                    {/* Номера страниц */}
                    {paginationPages.map((page, index) => {
                      if (page === 'ellipsis') {
                        return (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {/* Кнопка Next */}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{t('results.notFound')}</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                {t('results.resetFilters')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Модальное окно ИИ-Советника */}
      <AdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        onRecommend={handleAdvisorRecommend}
      />
    </div>
  );
};

export default HomePage;

