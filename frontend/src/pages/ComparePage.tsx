import { Link } from 'react-router-dom';
import { Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { useCompareStore } from '../store/useCompareStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

  if (compareList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Сравнение университетов</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-6">Добавьте вузы для сравнения</p>
            <Button asChild>
              <Link to="/">Перейти к каталогу</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Сравнение университетов</h1>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Параметр</TableHead>
                {compareList.map((university) => (
                  <TableHead key={university.id}>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Город</TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id}>{university.city}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Стоимость</TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id}>
                    {university.price.toLocaleString()} ₸
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Рейтинг</TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id}>{university.rating}/5</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Проходной балл на грант</TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id}>{university.minEntScore}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Общежитие</TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id}>
                    {university.hasDormitory ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Военная кафедра</TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id}>
                    {university.hasMilitaryDept ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
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
        Вернуться к каталогу
      </Link>
    </div>
  );
};

export default ComparePage;

