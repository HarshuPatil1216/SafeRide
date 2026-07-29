import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

function AdminLayout() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                backgroundColor: 'background.default',
            }}
        >
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    p: 3,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default AdminLayout;