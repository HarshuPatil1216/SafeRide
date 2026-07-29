import { Paper, Typography } from '@mui/material';

function QuickActions() {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mt: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Quick Actions
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    mt: 1,
                    color: 'text.secondary',
                }}
            >
                Add Student, Add Driver, Create Route and other shortcuts will appear here.
            </Typography>
        </Paper>
    );
}

export default QuickActions;