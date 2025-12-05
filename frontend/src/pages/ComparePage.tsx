import { Link } from 'react-router-dom';
import { Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { useCompareStore } from '../store/useCompareStore';
import { useLocale } from '@/components/LocaleProvider';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const ComparePage = () => {
  const { compareList, removeFromCompare } = useCompareStore();
  const { t } = useLocale();

  if (compareList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{t('compare.title')}</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-6">{t('compare.empty')}</p>
            <Button asChild>
              <Link to="/">{t('compare.goToCatalog')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{t('compare.title')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] pl-6 pr-8">{t('compare.parameter')}</TableHead>
                {/* Пустая колонка-спейсер для центрирования */}
                <TableHead className="w-auto"></TableHead>
                {compareList.map((university) => (
                  <TableHead key={university.id} className="min-w-[200px] pl-6">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/university/${university.id}`}
                        className="text-foreground hover:text-foreground/80 transition-colors"
                      >
                        {university.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCompare(university.id)}
                        className="ml-4 h-8 w-8"
                        aria-label="Удалить из сравнения"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
                {/* Пустая колонка-спейсер для центрирования */}
                <TableHead className="w-auto"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.city')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">{university.city}</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.cost')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.price.toLocaleString()} ₸
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.rating')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">{university.rating}/5</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.minScore')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">{university.minEntScore}</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.dormitory')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.hasDormitory ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.type')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.isPrivate ? t('compare.private') : t('compare.public')}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.languages')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.languages && university.languages.length > 0
                      ? university.languages.join(', ')
                      : '-'}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.grantsPerYear')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.grantsPerYear ? university.grantsPerYear.toLocaleString() : '-'}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.exchangeProgram')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.international?.hasExchangeProgram ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.doubleDegree')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.international?.hasDoubleDegree ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.requiresIELTS')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.international?.requiresIELTS ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
      <Link
        to="/"
        className="inline-flex items-center mt-6 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('compare.backToCatalog')}
      </Link>
    </div>
  );
};

export default ComparePage;

