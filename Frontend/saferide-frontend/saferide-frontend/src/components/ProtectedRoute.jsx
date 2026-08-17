import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, initializing, user } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <LoadingSpinner label="Checking your session" size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
