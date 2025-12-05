import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Check, X, Play, ExternalLink, Heart, Scale, Calendar, GraduationCap, Globe } from 'lucide-react';
import { useCompareStore } from '../store/useCompareStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useLocale } from '@/components/LocaleProvider';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getUniversityById } from '../api/universityService';
import type { IUniversity } from '../types';
import { universities as mockUniversities } from '../data/mockData';

const UniversityDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [university, setUniversity] = useState<IUniversity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUniversity = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getUniversityById(id);
        setUniversity(data);
      } catch (error) {
        console.error('Ошибка при загрузке университета:', error);
        // Fallback на mock данные
        const mockUni = mockUniversities.find((u) => u.id === id);
        setUniversity(mockUni || null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUniversity();
  }, [id]);
  const { addToCompare, compareList, addProgramToCompare, compareProgramsList } = useCompareStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  const { t } = useLocale();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isInCompare = compareList.some((u) => u.id === id);
  const isFav = id ? isFavorite(id) : false;

  const handleFavoriteToggle = () => {
    if (!university) return;
    if (isFav) {
      removeFromFavorites(university.id);
    } else {
      addToFavorites(university);
    }
  };

  const isProgramInCompare = (programName: string) => {
    if (!id) return false;
    return compareProgramsList.some(
      (p) => p.universityId === id && p.program.name === programName
    );
  };

  const handleAddProgramToCompare = (program: { name: string; degree: 'Bachelor' | 'Master' | 'PhD'; description?: string }) => {
    if (!university || !id) return;
    addProgramToCompare(id, university.name, program);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Загрузка информации об университете...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-4">{t('details.notFound')}</h1>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t('details.backToCatalog')}
        </Link>
      </div>
    );
  }

  // Группировка программ по степеням
  const programsByDegree = {
    Bachelor: (university.academicPrograms || []).filter((p) => p.degree === 'Bachelor'),
    Master: (university.academicPrograms || []).filter((p) => p.degree === 'Master'),
    PhD: (university.academicPrograms || []).filter((p) => p.degree === 'PhD'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('details.back')}
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{university.name}</h1>
        <p className="text-muted-foreground">{university.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t('details.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="programs">{t('details.tabs.programs')}</TabsTrigger>
          <TabsTrigger value="admissions">{t('details.tabs.admissions')}</TabsTrigger>
          <TabsTrigger value="international">{t('details.tabs.international')}</TabsTrigger>
          <TabsTrigger value="details">{t('details.tabs.details')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {university.mission && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">{t('details.mission')}</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{university.mission}</p>
                </CardContent>
              </Card>
            )}
            {university.history && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">{t('details.history')}</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{university.history}</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">{t('details.overview.title')}</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{t('details.overview.city')}</span> {university.city}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">{t('details.overview.cost')}</span>{' '}
                    {university.price.toLocaleString()} ₸
                  </div>
                  <div>
                    <span className="font-medium">{t('details.overview.minScore')}</span> {university.minEntScore}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <span className="font-medium">{t('details.overview.rating')}</span> {university.rating}/5
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">{t('details.programs.title')}</h2>
            </CardHeader>
            <CardContent className="space-y-8">
              {programsByDegree.Bachelor.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">{t('details.programs.bachelor')}</h3>
                  </div>
                  <div className="space-y-3">
                    {programsByDegree.Bachelor.map((program, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{program.name}</h4>
                              {program.description && (
                                <p className="text-sm text-muted-foreground">{program.description}</p>
                              )}
                            </div>
                            <Button
                              variant={isProgramInCompare(program.name) ? 'outline' : 'default'}
                              size="sm"
                              onClick={() => handleAddProgramToCompare(program)}
                              disabled={isProgramInCompare(program.name)}
                            >
                              <Scale className="w-4 h-4 mr-2" />
                              {isProgramInCompare(program.name)
                                ? t('details.programs.alreadyInCompare')
                                : t('details.programs.addToCompare')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {programsByDegree.Master.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">{t('details.programs.master')}</h3>
                  </div>
                  <div className="space-y-3">
                    {programsByDegree.Master.map((program, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{program.name}</h4>
                              {program.description && (
                                <p className="text-sm text-muted-foreground">{program.description}</p>
                              )}
                            </div>
                            <Button
                              variant={isProgramInCompare(program.name) ? 'outline' : 'default'}
                              size="sm"
                              onClick={() => handleAddProgramToCompare(program)}
                              disabled={isProgramInCompare(program.name)}
                            >
                              <Scale className="w-4 h-4 mr-2" />
                              {isProgramInCompare(program.name)
                                ? t('details.programs.alreadyInCompare')
                                : t('details.programs.addToCompare')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {programsByDegree.PhD.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">{t('details.programs.phd')}</h3>
                  </div>
                  <div className="space-y-3">
                    {programsByDegree.PhD.map((program, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{program.name}</h4>
                              {program.description && (
                                <p className="text-sm text-muted-foreground">{program.description}</p>
                              )}
                            </div>
                            <Button
                              variant={isProgramInCompare(program.name) ? 'outline' : 'default'}
                              size="sm"
                              onClick={() => handleAddProgramToCompare(program)}
                              disabled={isProgramInCompare(program.name)}
                            >
                              <Scale className="w-4 h-4 mr-2" />
                              {isProgramInCompare(program.name)
                                ? t('details.programs.alreadyInCompare')
                                : t('details.programs.addToCompare')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {(!university.academicPrograms || university.academicPrograms.length === 0) && (
                <p className="text-muted-foreground text-center py-8">
                  Информация о программах пока недоступна
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admissions" className="mt-6">
          {university.admissions ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">{t('details.admissions.title')}</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      {t('details.admissions.requirements')}
                    </h3>
                    <ul className="space-y-2">
                      {university.admissions.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      {t('details.admissions.deadlines')}
                    </h3>
                    <div className="space-y-2">
                      {university.admissions.deadlines.map((deadline, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {deadline}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      {t('details.admissions.scholarships')}
                    </h3>
                    <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                      <CardContent className="p-4">
                        <ul className="space-y-2">
                          {university.admissions.scholarships.map((scholarship, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="w-4 h-4 text-yellow-600 fill-yellow-600 mt-1 flex-shrink-0" />
                              <span className="text-foreground font-medium">{scholarship}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t('details.admissions.procedure')}</h3>
                    <p className="text-muted-foreground">{university.admissions.procedure}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Информация о поступлении пока недоступна</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="international" className="mt-6">
          {university.international ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">{t('details.international.title')}</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('details.international.exchange')}</h3>
                  <ul className="space-y-2">
                    {university.international.exchangePrograms.map((program, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{program}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('details.international.partners')}</h3>
                  <div className="space-y-2">
                    {university.international.partners.map((partner, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <p className="text-muted-foreground">{partner}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('details.international.foreignStudents')}</h3>
                  <ul className="space-y-2">
                    {university.international.foreignStudentOpps.map((opp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Информация о международном сотрудничестве пока недоступна</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">{t('details.details.title')}</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t('details.details.dormitory')}</span>
                  {university.hasDormitory ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span>{t('details.details.yes')}</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-600" />
                      <span>{t('details.details.no')}</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => {
            if (!isInCompare) {
              addToCompare(university);
              toast({
                title: t('toast.addedToCompare'),
                description: t('toast.addedToCompareDescription', { name: university.name }),
                action: (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/compare')}
                    className="ml-2"
                  >
                    {t('toast.goToCompare')}
                  </Button>
                ),
              });
            }
          }}
          disabled={isInCompare}
          variant={isInCompare ? 'outline' : 'default'}
          className="w-full sm:w-auto"
        >
          {isInCompare ? t('details.alreadyInCompare') : t('details.addToCompare')}
        </Button>
        <Button
          onClick={handleFavoriteToggle}
          variant={isFav ? 'default' : 'outline'}
          className={`w-full sm:w-auto ${isFav ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isFav ? 'fill-current' : ''}`} />
          {isFav ? t('details.removeFromFavorites') : t('details.addToFavorites')}
        </Button>
        {university.hasTour && university.tourUrl && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="w-full sm:w-auto">
                <Play className="w-4 h-4 mr-2" />
                {t('details.virtualTour')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-full">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{t('details.virtualTourTitle')} {university.name}</DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(university.tourUrl, '_blank')}
                    className="h-8"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('details.openInNewWindow')}
                  </Button>
                </div>
              </DialogHeader>
              <div className="w-full h-[60vh] md:h-[80vh] rounded-md border overflow-hidden">
                <iframe
                  src={university.tourUrl}
                  className="w-full h-full border-0"
                  allow="fullscreen"
                  allowFullScreen
                  title={`${t('details.virtualTourTitle')} ${university.name}`}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default UniversityDetailsPage;
