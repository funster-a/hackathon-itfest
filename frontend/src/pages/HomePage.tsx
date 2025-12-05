import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';
import UniversityCard from '@/components/UniversityCard';

const HomePage = () => {
  const { userEntScore, setEntScore } = useCompareStore();
  const [entScoreInput, setEntScoreInput] = useState<string>('');

  const handleEntScoreChange = (value: string) => {
    setEntScoreInput(value);
    const numValue = value === '' ? null : Number(value);
    if (numValue === null || (!isNaN(numValue) && numValue >= 0 && numValue <= 140)) {
      setEntScore(numValue);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Каталог университетов</h1>

      {/* Блок фильтрации */}
      <Card className="mb-6">
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
              className="w-full sm:w-80"
            />
            <p className="text-sm text-muted-foreground">
              Введите ваш балл ЕНТ (0-140) для расчета шансов на грант
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {universities.map((university) => (
          <UniversityCard
            key={university.id}
            university={university}
            userEntScore={userEntScore}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

