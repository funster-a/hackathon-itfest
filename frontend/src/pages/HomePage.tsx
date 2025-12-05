import { useState, useMemo, useEffect } from 'react';
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
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';
import { useLocale } from '@/components/LocaleProvider';
import UniversityCard from '@/components/UniversityCard';

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
  const [entScoreInput, setEntScoreInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hasDormitory, setHasDormitory] = useState<boolean>(false);
  const [hasMilitaryDept, setHasMilitaryDept] = useState<boolean>(false);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const [professionsOpen, setProfessionsOpen] = useState<boolean>(false);
  const [degreesOpen, setDegreesOpen] = useState<boolean>(false);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);

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

  const handleEntScoreChange = (value: string) => {
    setEntScoreInput(value);
    const numValue = value === '' ? null : Number(value);
    if (numValue === null || (!isNaN(numValue) && numValue >= 0 && numValue <= 140)) {
      setEntScore(numValue);
    }
  };

  // Фильтрация университетов
  const filteredUniversities = useMemo(() => {
    return universities.filter((university) => {
      // Поиск по названию
      if (searchQuery && !university.name.toLowerCase().includes(searchQuery.toLowerCase())) {
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
      // Фильтр по военной кафедре (применяется только если выбрано)
      if (hasMilitaryDept && !university.hasMilitaryDept) {
        return false;
      }
      // Фильтр по стоимости обучения
      if (university.price < priceRange[0] || university.price > priceRange[1]) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedCity, hasDormitory, hasMilitaryDept, priceRange]);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, hasDormitory, hasMilitaryDept, selectedProfiles, selectedProfessions, selectedDegrees, priceRange]);

  // Вычисление пагинации
  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
  const paginatedUniversities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUniversities.slice(startIndex, endIndex);
  }, [filteredUniversities, currentPage]);

  // Функция для переключения страницы с прокруткой вверх
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const priceRangeData = useMemo(() => getPriceRange(universities), []);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity(null);
    setHasDormitory(false);
    setHasMilitaryDept(false);
    setSelectedProfiles([]);
    setSelectedProfessions([]);
    setSelectedDegrees([]);
    setPriceRange([priceRangeData.min, priceRangeData.max]);
  };

  const hasActiveFilters = 
    selectedCity !== null || 
    hasDormitory || 
    hasMilitaryDept || 
    selectedProfiles.length > 0 || 
    selectedProfessions.length > 0 ||
    selectedDegrees.length > 0 ||
    priceRange[0] !== priceRangeData.min ||
    priceRange[1] !== priceRangeData.max;

  const toggleProfile = (profile: string) => {
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
  };

  const toggleProfession = (profession: string) => {
    setSelectedProfessions((prev) =>
      prev.includes(profession)
        ? prev.filter((p) => p !== profession)
        : [...prev, profession]
    );
  };

  // Получаем доступные профессии для выбранных профилей
  const availableProfessions = useMemo(() => {
    const professions = new Set<string>();
    selectedProfiles.forEach((profile) => {
      (PROFESSIONS_BY_PROFILE[profile] || []).forEach((prof) => professions.add(prof));
    });
    return Array.from(professions).sort();
  }, [selectedProfiles]);

  const toggleDegree = (degree: string) => {
    setSelectedDegrees((prev) =>
      prev.includes(degree)
        ? prev.filter((d) => d !== degree)
        : [...prev, degree]
    );
  };

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
                  onClick={() => setFiltersVisible(!filtersVisible)}
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
          {filtersVisible && (
            <CardContent className="space-y-4">
            {/* Поиск */}
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
                    onClick={() => setSelectedCity(selectedCity === city ? null : city)}
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
                  onValueChange={(value) => {
                    if (Array.isArray(value) && value.length === 2) {
                      setPriceRange([value[0], value[1]]);
                    }
                  }}
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

            {/* Фильтр по научным степеням */}
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

            {/* Фильтр по военной кафедре - чекбокс */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="militaryDept"
                checked={hasMilitaryDept}
                onCheckedChange={(checked) => setHasMilitaryDept(checked === true)}
              />
              <label
                htmlFor="militaryDept"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t('filters.militaryDept')}
              </label>
            </div>
            </CardContent>
          )}
        </Card>

        {/* Абитуриент-Советник - справа */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">{t('advisor.title')}</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Input
                type="number"
                value={entScoreInput}
                onChange={(e) => handleEntScoreChange(e.target.value)}
                min="0"
                max="140"
                placeholder={t('advisor.inputPlaceholder')}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                {t('advisor.description')}
              </p>
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
                    {(() => {
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
                      
                      return pages.map((page, index) => {
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
                      });
                    })()}

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
    </div>
  );
};

export default HomePage;

