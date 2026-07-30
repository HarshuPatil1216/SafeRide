import {
    DirectionsBus,
    People,
    Route,
    School,
} from '@mui/icons-material';
import {
    Alert,
    CircularProgress,
    Grid,
    Stack,
} from '@mui/material';

import DashboardHeader from '../../components/dashboard/DashboardHeader';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentActivities from '../../components/dashboard/RecentActivities';
import StatCard from '../../components/dashboard/StatCard';
import useDashboard from '../../hooks/useDashboard';

function DashboardPage() {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useDashboard();

    return (
        <>
            <DashboardHeader />

            {isLoading && (
                <Stack
                    sx={{
                        minHeight: 180,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress />
                </Stack>
            )}

            {isError && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                >
                    {error.message || 'Dashboard data load करता आली नाही.'}
                </Alert>
            )}

            {data && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Students"
                            value={data.totalStudents}
                            icon={<School />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Drivers"
                            value={data.totalDrivers}
                            icon={<People />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Vehicles"
                            value={data.totalVehicles}
                            icon={<DirectionsBus />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Routes"
                            value={data.totalRoutes}
                            icon={<Route />}
                        />
                    </Grid>
                </Grid>
            )}

            <QuickActions />

            <RecentActivities />
        </>
    );
}

export default DashboardPage;