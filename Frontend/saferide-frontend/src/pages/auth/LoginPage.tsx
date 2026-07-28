import { Box, Typography } from '@mui/material';

function LoginPage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
            }}
        >
            <Typography variant="h3">
                SafeRide Login
            </Typography>
        </Box>
    );
}

export default LoginPage;