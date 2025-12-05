import { Outlet } from 'react-router-dom';
import Header from './Header';
import ScrollToTop from './ScrollToTop';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
      <ScrollToTop />
    </div>
  );
};

export default Layout;

