import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Moon, Sun, Languages, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from './ThemeProvider';
import { useLocale } from './LocaleProvider';
import { useFavoritesStore } from '../store/useFavoritesStore';
import FavoritesModal from './FavoritesModal';

const Header = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const { favorites } = useFavoritesStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDark(root.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // Если system, переключаем на противоположное системной теме
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'light'
        : 'dark';
      setTheme(systemTheme);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">{t('header.title')}</h1>
          </Link>
          
          {/* Навигация по центру */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('header.catalog')}
            </Link>
            <Link
              to="/compare"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/compare'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('header.compare')}
            </Link>
          </nav>

          {/* Управление справа */}
          <div className="flex items-center gap-2">
            <FavoritesModal>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
                <span className="sr-only">{t('header.favorites')}</span>
              </Button>
            </FavoritesModal>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Languages className="h-5 w-5" />
                  <span className="sr-only">Переключить язык</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[100]">
                <DropdownMenuItem 
                  onClick={() => setLocale('ru')}
                  className={locale === 'ru' ? 'bg-accent' : ''}
                >
                  <span className="flex-1">Русский</span>
                  {locale === 'ru' && <span className="ml-2">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLocale('kk')}
                  className={locale === 'kk' ? 'bg-accent' : ''}
                >
                  <span className="flex-1">Қазақша</span>
                  {locale === 'kk' && <span className="ml-2">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLocale('en')}
                  className={locale === 'en' ? 'bg-accent' : ''}
                >
                  <span className="flex-1">English</span>
                  {locale === 'en' && <span className="ml-2">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Переключить тему"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

