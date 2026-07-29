import {
    DirectionsBus,
    People,
    Route,
    School,
} from '@mui/icons-material';
import Grid from '@mui/material/Grid';

import DashboardHeader from '../../components/dashboard/DashboardHeader';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentActivities from '../../components/dashboard/RecentActivities';
import StatCard from '../../components/dashboard/StatCard';

function DashboardPage() {
    return (
        <>
            <DashboardHeader />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Students"
                        value={245}
                        icon={<School />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Drivers"
                        value={18}
                        icon={<People />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Vehicles"
                        value={12}
                        icon={<DirectionsBus />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Routes"
                        value={9}
                        icon={<Route />}
                    />
                </Grid>
            </Grid>

            <QuickActions />

            <RecentActivities />
        </>
    );
}

export default DashboardPage;