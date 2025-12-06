import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Bot, Send, Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sendChatMessage, type IChatContext } from '@/api/universityService';
import { universities as mockUniversities } from '@/data/mockData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiChatSidebar = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const params = useParams<{ id: string }>();

  // Определение контекста на основе текущего URL
  const getContext = (): IChatContext => {
    if (params.id) {
      const university = mockUniversities.find((u) => u.id === params.id);
      return {
        type: 'university',
        university,
      };
    }
    if (location.pathname === '/compare') {
      return { type: 'compare' };
    }
    return { type: 'home' };
  };

  // Получение текста контекста для отображения
  const getContextText = (): string => {
    const context = getContext();
    if (context.type === 'university' && context.university) {
      return `Просмотр: ${context.university.name}`;
    }
    if (context.type === 'compare') {
      return 'Страница сравнения';
    }
    return 'Главная страница / Каталог';
  };

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Приветственное сообщение при открытии или смене контекста
  useEffect(() => {
    if (open && messages.length === 0) {
      const context = getContext();
      let welcomeMessage = 'Привет! Я AI Advisor. Чем могу помочь?';
      
      if (context.type === 'university' && context.university) {
        welcomeMessage = `Привет! Я вижу, что вы просматриваете информацию о ${context.university.name}. Могу ответить на вопросы о стоимости, программах, общежитии и многом другом. Что вас интересует?`;
      } else if (context.type === 'compare') {
        welcomeMessage = 'Привет! Вы на странице сравнения университетов. Могу помочь с анализом и выбором. Что вас интересует?';
      }
      
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    }
  }, [open, location.pathname, params.id]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = getContext();
      const response = await sendChatMessage(input.trim(), context);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Плавающая кнопка */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:shadow-xl transition-shadow"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
        <span className="sr-only">Открыть AI Advisor</span>
      </Button>

      {/* Боковая панель */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <SheetTitle>AI Advisor</SheetTitle>
            </div>
            <SheetDescription className="text-xs text-muted-foreground">
              {getContextText()}
            </SheetDescription>
          </SheetHeader>

          {/* Область сообщений */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Область ввода */}
          <div className="border-t px-6 py-4 space-y-2">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите ваш вопрос..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px] shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Нажмите Enter для отправки, Shift+Enter для новой строки
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AiChatSidebar;

