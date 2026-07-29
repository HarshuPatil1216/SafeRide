import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import {
    DirectionsBus,
    PersonAdd,
    Route,
} from '@mui/icons-material';

const activities = [
    {
        title: 'New student added',
        description: 'Aarav Patil was added to Route A.',
        icon: <PersonAdd />,
    },
    {
        title: 'Vehicle assigned',
        description: 'Bus MH-12-AB-4587 was assigned to Route B.',
        icon: <DirectionsBus />,
    },
    {
        title: 'Route updated',
        description: 'Route C timing was updated.',
        icon: <Route />,
    },
];

function RecentActivities() {
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
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    mb: 2,
                }}
            >
                Recent Activities
            </Typography>

            <List disablePadding>
                {activities.map((activity, index) => (
                    <Box key={activity.title}>
                        <ListItem
                            disableGutters
                            sx={{
                                py: 1.5,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                    }}
                                >
                                    {activity.icon}
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={activity.title}
                                secondary={activity.description}
                            />
                        </ListItem>

                        {index < activities.length - 1 && <Divider />}
                    </Box>
                ))}
            </List>
        </Paper>
    );
}

export default RecentActivities;