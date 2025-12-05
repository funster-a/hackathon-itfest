import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Box, Heart } from 'lucide-react';
import type { IUniversity } from '../types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCompareStore } from '../store/useCompareStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useLocale } from './LocaleProvider';
import { useToast } from '@/hooks/use-toast';

interface UniversityCardProps {
  university: IUniversity;
  userEntScore: number | null;
}

const UniversityCard = ({ university, userEntScore }: UniversityCardProps) => {
  const { addToCompare, compareList } = useCompareStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  const { t } = useLocale();
  const { toast } = useToast();
  const navigate = useNavigate();
  const hasChance = userEntScore !== null && userEntScore >= university.minEntScore;
  const showIndicator = userEntScore !== null;
  const isInCompare = compareList.some((u) => u.id === university.id);
  const isFav = isFavorite(university.id);

  const handleAddToCompare = () => {
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
  };

  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFromFavorites(university.id);
    } else {
      addToFavorites(university);
    }
  };

  // Используем реальное изображение, если есть, иначе placeholder
  const imageUrl = university.imageUrl || `https://picsum.photos/seed/${university.id}/800/400`;

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
        <img
          src={imageUrl}
          alt={university.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          {university.hasTour && (
            <Badge
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white shadow-lg"
            >
              <Box className="w-3 h-3 mr-1.5" />
              {t('card.tour')}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              handleFavoriteToggle();
            }}
            className={`h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-lg ${
              isFav ? 'text-red-500' : 'text-gray-600'
            }`}
            aria-label={isFav ? t('card.removeFromFavorites') : t('card.addToFavorites')}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link
              to={`/university/${university.id}`}
              className="block"
            >
              <h3 className="text-xl font-semibold text-foreground hover:text-foreground/80 transition-colors">
                {university.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-foreground font-medium">{university.rating}</span>
            </div>
          </div>
          {showIndicator && (
            <Badge
              variant={hasChance ? 'secondary' : 'destructive'}
              className="ml-auto"
            >
              {hasChance ? t('card.chanceForGrant') : t('card.onlyPaid')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {university.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{university.city}</span>
          </div>
          <div className="text-foreground">
            <span className="font-medium">{t('card.cost')}</span>{' '}
            {university.price.toLocaleString()} ₸
          </div>
          <div className="text-foreground">
            <span className="font-medium">{t('card.minScore')}</span> {university.minEntScore}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={isInCompare ? 'outline' : 'default'}
          onClick={handleAddToCompare}
          disabled={isInCompare}
          className="w-full"
        >
          {isInCompare ? t('card.alreadyInCompare') : t('card.addToCompare')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UniversityCard;

