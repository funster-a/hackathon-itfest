import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Check, X, Play, ExternalLink, Heart } from 'lucide-react';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useLocale } from '@/components/LocaleProvider';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const UniversityDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const university = universities.find((u) => u.id === id);
  const { addToCompare, compareList } = useCompareStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  const { t } = useLocale();
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
        <TabsList>
          <TabsTrigger value="overview">{t('details.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="details">{t('details.tabs.details')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
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
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t('details.details.militaryDept')}</span>
                  {university.hasMilitaryDept ? (
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
          onClick={() => addToCompare(university)}
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

