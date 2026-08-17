import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Parents from "./pages/admin/Parents";
import Drivers from "./pages/admin/Drivers";
import Vehicles from "./pages/admin/Vehicles";
import AdminRoutes from "./pages/admin/Routes";
import Stops from "./pages/admin/Stops";
import Rides from "./pages/admin/Rides";
import AdminNotifications from "./pages/admin/Notifications";
import Reports from "./pages/admin/Reports";
import Search from "./pages/admin/Search";

import DriverLayout from "./layouts/DriverLayout";
import DriverRideControl from "./pages/driver/RideControl";
import DriverStudentEvents from "./pages/driver/StudentEvents";
import DriverVehicleLocation from "./pages/driver/VehicleLocation";
import DriverSetup from "./pages/driver/Setup";

import ParentLayout from "./layouts/ParentLayout";
import ParentNotifications from "./pages/parent/Notifications";
import ParentStudentEvents from "./pages/parent/StudentEvents";
import ParentTracking from "./pages/parent/Tracking";
import ParentSetup from "./pages/parent/Setup";

import { homeForRole, ROLES } from "./utils/constants";

function RootRedirect() {
  const { isAuthenticated, initializing, user } = useAuth();
  if (initializing) return null;
  return <Navigate to={isAuthenticated ? homeForRole(user?.role) : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="parents" element={<Parents />} />
              <Route path="drivers" element={<Drivers />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="routes" element={<AdminRoutes />} />
              <Route path="stops" element={<Stops />} />
              <Route path="rides" element={<Rides />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="reports" element={<Reports />} />
              <Route path="search" element={<Search />} />
            </Route>

            <Route
              path="/driver"
              element={
                <ProtectedRoute roles={[ROLES.DRIVER]}>
                  <DriverLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DriverRideControl />} />
              <Route path="students" element={<DriverStudentEvents />} />
              <Route path="location" element={<DriverVehicleLocation />} />
              <Route path="setup" element={<DriverSetup />} />
            </Route>

            <Route
              path="/parent"
              element={
                <ProtectedRoute roles={[ROLES.PARENT]}>
                  <ParentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ParentNotifications />} />
              <Route path="student" element={<ParentStudentEvents />} />
              <Route path="tracking" element={<ParentTracking />} />
              <Route path="setup" element={<ParentSetup />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
