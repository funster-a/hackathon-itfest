import { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, X } from 'lucide-react';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';
import UniversityCard from '@/components/UniversityCard';

const HomePage = () => {
  const { userEntScore, setEntScore } = useCompareStore();
  const [entScoreInput, setEntScoreInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hasDormitory, setHasDormitory] = useState<boolean | null>(null);
  const [hasMilitaryDept, setHasMilitaryDept] = useState<boolean | null>(null);

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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity(null);
    setHasDormitory(null);
    setHasMilitaryDept(null);
  };

  const hasActiveFilters = selectedCity !== null || hasDormitory !== null || hasMilitaryDept !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Каталог университетов</h1>

      {/* Блок фильтров и советника */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Фильтры - слева */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between h-8">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Фильтры
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
                    Сбросить
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Поиск */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Поиск</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Название университета..."
                  className="pl-9"
                />
              </div>
            </div>

            <Separator />

            {/* Фильтр по городу */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Город</label>
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

            {/* Фильтр по общежитию */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Общежитие</label>
              <div className="flex gap-2">
                <Button
                  variant={hasDormitory === true ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setHasDormitory(hasDormitory === true ? null : true)}
                  className="flex-1"
                >
                  Есть
                </Button>
                <Button
                  variant={hasDormitory === false ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setHasDormitory(hasDormitory === false ? null : false)}
                  className="flex-1"
                >
                  Нет
                </Button>
              </div>
            </div>

            <Separator />

            {/* Фильтр по военной кафедре */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Военная кафедра</label>
              <div className="flex gap-2">
                <Button
                  variant={hasMilitaryDept === true ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setHasMilitaryDept(hasMilitaryDept === true ? null : true)}
                  className="flex-1"
                >
                  Есть
                </Button>
                <Button
                  variant={hasMilitaryDept === false ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setHasMilitaryDept(hasMilitaryDept === false ? null : false)}
                  className="flex-1"
                >
                  Нет
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Абитуриент-Советник - справа */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Абитуриент-Советник</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Input
                type="number"
                value={entScoreInput}
                onChange={(e) => handleEntScoreChange(e.target.value)}
                min="0"
                max="140"
                placeholder="Твой балл ЕНТ"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Введите ваш балл ЕНТ (0-140) для расчета шансов на грант
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Результаты */}
      <div className="flex flex-col gap-4">
        {filteredUniversities.length > 0 ? (
          filteredUniversities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
              userEntScore={userEntScore}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Университеты не найдены</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomePage;

