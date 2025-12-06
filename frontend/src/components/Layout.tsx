import { Outlet } from 'react-router-dom';
import Header from './Header';
import ScrollToTop from './ScrollToTop';
import { Toaster } from '@/components/ui/toaster';
import AddUniversityModal from './AddUniversityModal';
import { Button } from '@/components/ui/button';
import AiChatSidebar from './AiChatSidebar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-border bg-background py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © 2025 ZeroHub
            </p>
            <AddUniversityModal>
              <Button variant="link" className="text-sm font-medium">
                Вы представитель вуза?
              </Button>
            </AddUniversityModal>
          </div>
        </div>
      </footer>
      <ScrollToTop />
      <Toaster />
      <AiChatSidebar />
    </div>
  );
};

export default Layout;

