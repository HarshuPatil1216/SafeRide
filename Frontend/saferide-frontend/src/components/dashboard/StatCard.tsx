import type { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

type StatCardProps = {
    title: string;
    value: number | string;
    icon: ReactNode;
};

function StatCard({ title, value, icon }: StatCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Box>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mb: 1,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    {value}
                </Typography>
            </Box>

            <Box
                sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                }}
            >
                {icon}
            </Box>
        </Paper>
    );
}

export default StatCard;