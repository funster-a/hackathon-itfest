import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { LocaleProvider } from './components/LocaleProvider';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UniversityDetailsPage from './pages/UniversityDetailsPage';
import ComparePage from './pages/ComparePage';

function App() {
  return (
    <LocaleProvider defaultLocale="ru" storageKey="university-app-locale">
      <ThemeProvider defaultTheme="system" storageKey="university-app-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="university/:id" element={<UniversityDetailsPage />} />
              <Route path="compare" element={<ComparePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LocaleProvider>
  );
}

export default App;
