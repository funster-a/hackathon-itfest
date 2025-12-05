import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { IAdvisorRequest } from '../types';
import { Loader2 } from 'lucide-react';

interface AdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommend: (data: IAdvisorRequest) => Promise<void>;
}

const AdvisorModal = ({ isOpen, onClose, onRecommend }: AdvisorModalProps) => {
  const [formData, setFormData] = useState<IAdvisorRequest>({
    ent_score: 0,
    profile_subjects: '',
    interests: '',
    preferred_city: '',
    career_goal: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ent_score' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.ent_score || !formData.profile_subjects || !formData.interests || !formData.preferred_city || !formData.career_goal) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onRecommend(formData);
      // Форма не закрывается здесь, это делает родительский компонент после получения результата
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        ent_score: 0,
        profile_subjects: '',
        interests: '',
        preferred_city: '',
        career_goal: '',
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Анкета для ИИ-Советника</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ent_score">Балл ЕНТ *</Label>
            <Input
              id="ent_score"
              name="ent_score"
              type="number"
              min="0"
              max="140"
              value={formData.ent_score || ''}
              onChange={handleChange}
              placeholder="Введите ваш балл ЕНТ"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile_subjects">Профильные предметы *</Label>
            <Input
              id="profile_subjects"
              name="profile_subjects"
              value={formData.profile_subjects}
              onChange={handleChange}
              placeholder="Например: Мат/Инф"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Интересы/Хобби *</Label>
            <Textarea
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="Люблю кодить, игры..."
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred_city">Желаемый город *</Label>
            <Input
              id="preferred_city"
              name="preferred_city"
              value={formData.preferred_city}
              onChange={handleChange}
              placeholder="Например: Алматы"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="career_goal">Карьерная цель *</Label>
            <Input
              id="career_goal"
              name="career_goal"
              value={formData.career_goal}
              onChange={handleChange}
              placeholder="Например: Стать CTO"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.ent_score || !formData.profile_subjects || !formData.interests || !formData.preferred_city || !formData.career_goal}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              'Получить совет'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvisorModal;

