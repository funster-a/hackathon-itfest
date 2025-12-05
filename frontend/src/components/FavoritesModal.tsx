import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, MapPin, Star } from 'lucide-react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useLocale } from './LocaleProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FavoritesModalProps {
  children: React.ReactNode;
}

const FavoritesModal = ({ children }: FavoritesModalProps) => {
  const { favorites, removeFromFavorites } = useFavoritesStore();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-2xl h-[60vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            {t('favorites.title')} ({favorites.length})
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4 flex-1 overflow-y-auto min-h-0">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">{t('favorites.empty')}</p>
            </div>
          ) : (
            favorites.map((university) => (
              <Card key={university.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        to={`/university/${university.id}`}
                        onClick={() => setOpen(false)}
                        className="block mb-2"
                      >
                        <h3 className="text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors">
                          {university.name}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{university.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{university.rating}</span>
                        </div>
                        <div>
                          {university.price.toLocaleString()} ₸
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromFavorites(university.id)}
                      className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                      aria-label={t('favorites.remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesModal;

