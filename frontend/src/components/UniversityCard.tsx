import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import type { IUniversity } from '../types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCompareStore } from '../store/useCompareStore';

interface UniversityCardProps {
  university: IUniversity;
  userEntScore: number | null;
}

const UniversityCard = ({ university, userEntScore }: UniversityCardProps) => {
  const { addToCompare, compareList } = useCompareStore();
  const hasChance = userEntScore !== null && userEntScore >= university.minEntScore;
  const showIndicator = userEntScore !== null;
  const isInCompare = compareList.some((u) => u.id === university.id);

  // Генерируем разные placeholder изображения для каждого университета
  const imageUrl = `https://picsum.photos/seed/${university.id}/800/400`;

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
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <Link
            to={`/university/${university.id}`}
            className="flex-1"
          >
            <h3 className="text-xl font-semibold text-foreground hover:text-foreground/80 transition-colors">
              {university.name}
            </h3>
          </Link>
          {showIndicator && (
            <Badge
              variant={hasChance ? 'secondary' : 'destructive'}
              className="ml-auto"
            >
              {hasChance ? 'Шанс на грант' : 'Только платно'}
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
            <span className="font-medium">Стоимость:</span>{' '}
            {university.price.toLocaleString()} ₸
          </div>
          <div className="text-foreground">
            <span className="font-medium">Проходной балл:</span> {university.minEntScore}
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-foreground">{university.rating}/5</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={isInCompare ? 'outline' : 'default'}
          onClick={() => addToCompare(university)}
          disabled={isInCompare}
          className="w-full"
        >
          {isInCompare ? 'Уже в сравнении' : 'Добавить к сравнению'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UniversityCard;

