import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';

import { Login } from './pages/Login';
import CustomDecksPage from './pages/CustomDecksPage';
import DeckDetailPage from './pages/DeckDetailPage';
import CustomReviewPage from './pages/CustomReviewPage';
import CustomPreviewDeckPage from './pages/CustomPreviewDeckPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminLessonsPage from './pages/admin/AdminLessonsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/decks" replace />} />
      
      {/* User Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Navigate to="/decks" replace />} />
        <Route path="/decks" element={<CustomDecksPage />} />
        <Route path="/decks/:id" element={<DeckDetailPage />} />
        <Route path="/decks/:id/preview" element={<CustomPreviewDeckPage />} />
        <Route path="/decks/:id/review" element={<CustomReviewPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" index element={<AdminDashboardPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/courses/:courseId/lessons" element={<AdminLessonsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
