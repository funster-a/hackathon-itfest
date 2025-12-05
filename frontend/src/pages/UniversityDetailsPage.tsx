import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Check, X } from 'lucide-react';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const UniversityDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const university = universities.find((u) => u.id === id);
  const { addToCompare, compareList } = useCompareStore();
  const isInCompare = compareList.some((u) => u.id === id);

  if (!university) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Университет не найден</h1>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Вернуться к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад к каталогу
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{university.name}</h1>
        <p className="text-muted-foreground">{university.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="details">Детали</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Основная информация</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Город:</span> {university.city}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Стоимость обучения:</span>{' '}
                  {university.price.toLocaleString()} ₸
                </div>
                <div>
                  <span className="font-medium">Проходной балл на грант:</span> {university.minEntScore}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <div>
                    <span className="font-medium">Рейтинг:</span> {university.rating}/5
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Дополнительная информация</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Общежитие:</span>
                  {university.hasDormitory ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Да</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-600" />
                      <span>Нет</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Военная кафедра:</span>
                  {university.hasMilitaryDept ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Да</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-600" />
                      <span>Нет</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button
          onClick={() => addToCompare(university)}
          disabled={isInCompare}
          variant={isInCompare ? 'outline' : 'default'}
          className="w-full sm:w-auto"
        >
          {isInCompare ? 'Уже в сравнении' : 'Добавить к сравнению'}
        </Button>
      </div>
    </div>
  );
};

export default UniversityDetailsPage;

