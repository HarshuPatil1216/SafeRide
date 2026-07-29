import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<LoginPage />} />

            <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;