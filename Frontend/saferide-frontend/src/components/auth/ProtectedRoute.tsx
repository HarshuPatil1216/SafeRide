import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = String(user.role).toUpperCase();
    const hasRole = allowedRoles.some((role) => {
      const targetRole = String(role).toUpperCase();
      return (
        userRole === targetRole ||
        userRole === `ROLE_${targetRole}` ||
        `ROLE_${userRole}` === targetRole
      );
    });

    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
