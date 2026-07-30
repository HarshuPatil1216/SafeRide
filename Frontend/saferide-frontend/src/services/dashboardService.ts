import axios from 'axios';

export type DashboardStats = {
    totalStudents: number;
    totalParents: number;
    totalDrivers: number;
    totalVehicles: number;
    totalRoutes: number;
    totalStops: number;
    totalRides: number;
    completedRides: number;
    runningRides: number;
    scheduledRides: number;
    totalNotifications: number;
    unreadNotifications: number;
};

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

export async function getDashboardStats(): Promise<DashboardStats> {
    const token = localStorage.getItem('token');

    const response = await api.get<DashboardStats>('/dashboard', {
        headers: token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : undefined,
    });

    return response.data;
}