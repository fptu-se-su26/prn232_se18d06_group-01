import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';

import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomDecksPage from './pages/CustomDecksPage';
import DeckDetailPage from './pages/DeckDetailPage';
import CustomPreviewDeckPage from './pages/CustomPreviewDeckPage';
import DeckQuizPage from './pages/DeckQuizPage';
import ExplorePage from './pages/ExplorePage';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Check if role is Admin or 1
  if (user?.role !== 'Admin' && user?.role !== 1) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<LandingPage />} />
      
      {/* User Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/decks" element={<CustomDecksPage />} />
        <Route path="/decks/:id" element={<DeckDetailPage />} />
        <Route path="/decks/:id/preview" element={<CustomPreviewDeckPage />} />
        <Route path="/decks/:id/quiz" element={<DeckQuizPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Route>
    </Routes>
  );
}


function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
