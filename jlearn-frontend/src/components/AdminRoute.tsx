import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is an admin
  // The role might be "Admin" (string) or a specific ID depending on the backend
  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
