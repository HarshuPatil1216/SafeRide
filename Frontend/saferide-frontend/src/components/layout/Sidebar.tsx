import {
    Assessment,
    Dashboard,
    DirectionsBus,
    LocationOn,
    Notifications,
    People,
    Person,
    Route,
    School,
} from '@mui/icons-material';

import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';

import { NavLink } from 'react-router-dom';

const menuItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <Dashboard />,
    },
    {
        label: 'Students',
        path: '/students',
        icon: <School />,
    },
    {
        label: 'Parents',
        path: '/parents',
        icon: <People />,
    },
    {
        label: 'Drivers',
        path: '/drivers',
        icon: <Person />,
    },
    {
        label: 'Vehicles',
        path: '/vehicles',
        icon: <DirectionsBus />,
    },
    {
        label: 'Routes',
        path: '/routes',
        icon: <Route />,
    },
    {
        label: 'Stops',
        path: '/stops',
        icon: <LocationOn />,
    },
    {
        label: 'Rides',
        path: '/rides',
        icon: <DirectionsBus />,
    },
    {
        label: 'Reports',
        path: '/reports',
        icon: <Assessment />,
    },
    {
        label: 'Notifications',
        path: '/notifications',
        icon: <Notifications />,
    },
];

function Sidebar() {
    return (
        <Box
            component="aside"
            sx={{
                width: 260,
                minHeight: '100vh',
                borderRight: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                    }}
                >
                    Admin Panel
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Admin Panel
                </Typography>
            </Box>

            <List
                sx={{
                    px: 2,
                    py: 2,
                    flexGrow: 1,
                }}
            >
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        sx={{
                            mb: 0.5,
                            borderRadius: 2,
                            color: 'text.secondary',

                            '&.active': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',

                                '& .MuiListItemIcon-root': {
                                    color: 'primary.contrastText',
                                },
                            },

                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 40,
                                color: 'inherit',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.label}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}

export default Sidebar;