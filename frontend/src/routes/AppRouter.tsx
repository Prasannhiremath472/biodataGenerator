import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import TemplateGalleryPage from '@/pages/TemplateGalleryPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CreateBiodataPage from '@/pages/CreateBiodataPage';
import { RequireAuth } from './RequireAuth';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/templates" element={<TemplateGalleryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/create-biodata"
        element={
          <RequireAuth>
            <CreateBiodataPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
