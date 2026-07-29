import { Box, Typography } from '@mui/material';

function DashboardHeader() {
    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <Box
            sx={{
                mb: 4,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                }}
            >
                Welcome back, Admin 👋
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    mt: 1,
                    color: 'text.secondary',
                }}
            >
                {today}
            </Typography>
        </Box>
    );
}

export default DashboardHeader;