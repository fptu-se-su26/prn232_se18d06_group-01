import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import LessonDetailPage from './pages/LessonDetailPage';
import ReviewQueuePage from './pages/ReviewQueuePage';
import { QuizPage } from './pages/QuizPage';

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
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* User Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<LessonDetailPage />} />
        <Route path="/reviews" element={<ReviewQueuePage />} />
        <Route path="/quizzes/lesson/:lessonId" element={<QuizPage />} />
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
