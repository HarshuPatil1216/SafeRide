import { useQuery } from '@tanstack/react-query';

import {
    getDashboardStats,
    type DashboardStats,
} from '../services/dashboardService';

function useDashboard() {
    return useQuery<DashboardStats, Error>({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats,
    });
}

export default useDashboard;