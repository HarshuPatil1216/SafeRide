import { Logout, Notifications } from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function TopNavbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            color="inherit"
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    Dashboard
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <IconButton aria-label="notifications">
                        <Badge badgeContent={3} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <IconButton
                        aria-label="logout"
                        color="inherit"
                        onClick={handleLogout}
                    >
                        <Logout />
                    </IconButton>

                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                        }}
                    >
                        A
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopNavbar;