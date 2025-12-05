import { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';
import { useLocale } from '@/components/LocaleProvider';
import UniversityCard from '@/components/UniversityCard';

const ITEMS_PER_PAGE = 9;

// Моковые данные для фильтров
const ACADEMIC_DISCIPLINES = [
  'Информационные технологии',
  'Инженерия',
  'Бизнес и экономика',
  'Медицина',
  'Гуманитарные науки',
  'Естественные науки',
  'Право',
  'Педагогика',
  'Архитектура',
  'Дизайн',
];

const DEGREES = [
  'Бакалавриат',
  'Магистратура',
  'Докторантура',
];

const HomePage = () => {
  const { userEntScore, setEntScore } = useCompareStore();
  const { t } = useLocale();
  const [entScoreInput, setEntScoreInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hasDormitory, setHasDormitory] = useState<boolean>(false);
  const [hasMilitaryDept, setHasMilitaryDept] = useState<boolean>(false);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [disciplinesOpen, setDisciplinesOpen] = useState<boolean>(false);
  const [degreesOpen, setDegreesOpen] = useState<boolean>(false);

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
      // Фильтр по общежитию
      if (hasDormitory !== null && university.hasDormitory !== hasDormitory) {
        return false;
      }
      // Фильтр по военной кафедре
      if (hasMilitaryDept !== null && university.hasMilitaryDept !== hasMilitaryDept) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedCity, hasDormitory, hasMilitaryDept]);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, hasDormitory, hasMilitaryDept, selectedDisciplines, selectedDegrees]);

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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity(null);
    setHasDormitory(false);
    setHasMilitaryDept(false);
    setSelectedDisciplines([]);
    setSelectedDegrees([]);
  };

  const hasActiveFilters = 
    selectedCity !== null || 
    hasDormitory || 
    hasMilitaryDept || 
    selectedDisciplines.length > 0 || 
    selectedDegrees.length > 0;

  const toggleDiscipline = (discipline: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(discipline)
        ? prev.filter((d) => d !== discipline)
        : [...prev, discipline]
    );
  };

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
              <div className="h-8 flex items-center">
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
              </div>
            </div>
          </CardHeader>
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

            {/* Фильтр по академическим дисциплинам */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('filters.disciplines')}</label>
              <DropdownMenu 
                modal={false} 
                open={disciplinesOpen} 
                onOpenChange={setDisciplinesOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedDisciplines.length > 0
                      ? `${selectedDisciplines.length} ${t('filters.selected')}`
                      : t('filters.selectDisciplines')}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 max-h-[300px] overflow-y-auto"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DropdownMenuLabel>{t('filters.disciplines')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {ACADEMIC_DISCIPLINES.map((discipline) => (
                    <DropdownMenuCheckboxItem
                      key={discipline}
                      checked={selectedDisciplines.includes(discipline)}
                      onCheckedChange={() => toggleDiscipline(discipline)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {discipline}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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

