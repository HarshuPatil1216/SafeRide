import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';

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
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <TopNavbar />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default AdminLayout;