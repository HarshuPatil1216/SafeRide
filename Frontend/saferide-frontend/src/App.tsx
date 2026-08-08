import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

import StudentsPage from './pages/students/StudentsPage';
import ParentsPage from './pages/parents/ParentsPage';
import DriversPage from './pages/drivers/DriversPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';

import ProtectedRoute from './routes/ProtectedRoute';

function App() {

    return (
        <Routes>

            {/* Default Route */}
            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* Login */}
            <Route
                path="/login"
                element={<LoginPage />}
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>

                <Route element={<AdminLayout />}>

                    {/* Dashboard */}
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    {/* Students */}
                    <Route
                        path="/students"
                        element={<StudentsPage />}
                    />

                    {/* Parents */}
                    <Route
                        path="/parents"
                        element={<ParentsPage />}
                    />

                    {/* Drivers */}
                    <Route
                        path="/drivers"
                        element={<DriversPage />}
                    />

                    {/* Vehicles */}
                    <Route
                        path="/vehicles"
                        element={<VehiclesPage />}
                    />

                </Route>

            </Route>

            {/* Unknown Route */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default App;