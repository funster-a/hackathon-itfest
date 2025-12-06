import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { compareWithAi, type ICompareAiResponse } from '@/api/universityService';
import type { IUniversity } from '@/types';

interface CompareArbitrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  universities: IUniversity[];
}

const CompareArbitrationModal = ({
  open,
  onOpenChange,
  universities,
}: CompareArbitrationModalProps) => {
  const [userGoal, setUserGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ICompareAiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!userGoal.trim()) {
      setError('Пожалуйста, укажите ваши приоритеты');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await compareWithAi({
        universities,
        userGoal: userGoal.trim(),
      });
      setResult(response);
    } catch (err) {
      setError('Произошла ошибка при сравнении. Попробуйте еще раз.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Сбрасываем состояние при закрытии
    setTimeout(() => {
      setUserGoal('');
      setResult(null);
      setError(null);
    }, 200);
  };

  // Функция для рендеринга markdown-подобного текста
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let listItems: string[] = [];
    let inList = false;

    const closeList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 mb-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="ml-2">{renderTextWithBold(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const renderTextWithBold = (text: string) => {
      const parts: React.ReactNode[] = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`bold-${parts.length}`} className="font-semibold">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : text;
    };

    const closeParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ');
        elements.push(
          <p key={`p-${elements.length}`} className="mb-2">
            {renderTextWithBold(paragraphText)}
          </p>
        );
        currentParagraph = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Заголовки
      if (trimmed.startsWith('## ')) {
        closeParagraph();
        closeList();
        elements.push(
          <h3 key={`h-${index}`} className="text-lg font-semibold mt-4 mb-2">
            {trimmed.substring(3)}
          </h3>
        );
        return;
      }

      // Списки
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        closeParagraph();
        if (!inList) {
          inList = true;
        }
        listItems.push(trimmed.substring(2));
        return;
      }

      // Обычный текст
      if (trimmed) {
        closeList();
        currentParagraph.push(trimmed);
      } else {
        // Пустая строка - завершаем параграф и список
        closeParagraph();
        closeList();
      }
    });

    // Завершаем последний параграф и список
    closeParagraph();
    closeList();

    return elements;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Сравнение с ИИ
          </DialogTitle>
          <DialogDescription>
            Опишите, что для вас важнее всего при выборе университета, и ИИ поможет определить лучший вариант
          </DialogDescription>
        </DialogHeader>

        {!result && !loading && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userGoal">
                Что для вас важнее всего? (например: низкая цена, качество общаги, карьера в Big4, программирование)
              </Label>
              <Textarea
                id="userGoal"
                placeholder="Например: Мне важна низкая цена и возможность получить работу программистом после выпуска..."
                value={userGoal}
                onChange={(e) => {
                  setUserGoal(e.target.value);
                  setError(null);
                }}
                className="min-h-[100px]"
                disabled={loading}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              ИИ анализирует университеты...
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4">
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Рекомендация ИИ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Лучший выбор:
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {result.winner}
                  </p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="text-sm space-y-2">
                    {renderMarkdown(result.analysis)}
                  </div>
                </div>
                {result.reasoning && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground italic">
                      {result.reasoning}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          {!result && !loading && (
            <Button onClick={handleCompare} disabled={loading || !userGoal.trim()}>
              <Sparkles className="w-4 h-4 mr-2" />
              Сравнить
            </Button>
          )}
          {result && (
            <Button onClick={handleClose} variant="outline">
              Закрыть
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompareArbitrationModal;

