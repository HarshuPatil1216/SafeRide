import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

import StudentsPage from './pages/students/StudentsPage';
import ParentsPage from './pages/parents/ParentsPage';

import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route element={<ProtectedRoute />}>

                <Route element={<AdminLayout />}>

                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/students"
                        element={<StudentsPage />}
                    />

                    <Route
                        path="/parents"
                        element={<ParentsPage />}
                    />

                </Route>

            </Route>

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