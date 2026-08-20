import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UserRole } from './types';

// Layouts
import { AdminLayout } from './components/layout/AdminLayout';
import { DriverLayout } from './components/layout/DriverLayout';
import { ParentLayout } from './components/layout/ParentLayout';

// Auth Pages
import { Login } from './pages/auth/Login';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentsPage } from './pages/admin/StudentsPage';
import { ParentsPage } from './pages/admin/ParentsPage';
import { DriversPage } from './pages/admin/DriversPage';
import { VehiclesPage } from './pages/admin/VehiclesPage';
import { RoutesPage } from './pages/admin/RoutesPage';
import { StopsPage } from './pages/admin/StopsPage';
import { RidesPage } from './pages/admin/RidesPage';
import { LiveTrackingPage } from './pages/admin/LiveTrackingPage';
import { NotificationsPage } from './pages/admin/NotificationsPage';
import { ReportsPage } from './pages/admin/ReportsPage';

// Driver Pages
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DriverTripPage } from './pages/driver/DriverTripPage';
import { DriverNotificationsPage } from './pages/driver/DriverNotificationsPage';

// Parent Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentLiveTrackingPage } from './pages/parent/ParentLiveTrackingPage';
import { ParentChildrenPage } from './pages/parent/ParentChildrenPage';
import { ParentNotificationsPage } from './pages/parent/ParentNotificationsPage';

// Common Pages
import { ProfilePage } from './pages/common/ProfilePage';
import { Unauthorized } from './pages/common/Unauthorized';
import { NotFound } from './pages/common/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Component to redirect root `/` to the user's role-specific dashboard or `/login`
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user?.role || '').toUpperCase();
  if (role.includes('ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (role.includes('DRIVER')) {
    return <Navigate to="/driver/dashboard" replace />;
  }
  return <Navigate to="/parent/dashboard" replace />;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ADMIN PORTAL ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ROLE_ADMIN]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="parents" element={<ParentsPage />} />
              <Route path="drivers" element={<DriversPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="routes" element={<RoutesPage />} />
              <Route path="stops" element={<StopsPage />} />
              <Route path="rides" element={<RidesPage />} />
              <Route path="live-tracking" element={<LiveTrackingPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>

            {/* DRIVER PORTAL ROUTES */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={[UserRole.DRIVER, UserRole.ROLE_DRIVER]}>
                  <DriverLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/driver/dashboard" replace />} />
              <Route path="dashboard" element={<DriverDashboard />} />
              <Route path="trip" element={<DriverTripPage />} />
              <Route path="notifications" element={<DriverNotificationsPage />} />
            </Route>

            {/* PARENT PORTAL ROUTES */}
            <Route
              path="/parent"
              element={
                <ProtectedRoute allowedRoles={[UserRole.PARENT, UserRole.ROLE_PARENT]}>
                  <ParentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/parent/dashboard" replace />} />
              <Route path="dashboard" element={<ParentDashboard />} />
              <Route path="live-tracking" element={<ParentLiveTrackingPage />} />
              <Route path="children" element={<ParentChildrenPage />} />
              <Route path="notifications" element={<ParentNotificationsPage />} />
            </Route>

            {/* Common User Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AdminLayout title="User Profile">
                    <ProfilePage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
