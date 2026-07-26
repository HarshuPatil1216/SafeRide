package com.saferide.dto;

public class AdminDashboardResponse {

    private long totalStudents;
    private long totalParents;
    private long totalDrivers;
    private long totalVehicles;
    private long totalRoutes;
    private long totalStops;
    private long totalActiveRides;
    private long totalNotifications;
    private long unreadNotifications;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(
            long totalStudents,
            long totalParents,
            long totalDrivers,
            long totalVehicles,
            long totalRoutes,
            long totalStops,
            long totalActiveRides,
            long totalNotifications,
            long unreadNotifications
    ) {
        this.totalStudents = totalStudents;
        this.totalParents = totalParents;
        this.totalDrivers = totalDrivers;
        this.totalVehicles = totalVehicles;
        this.totalRoutes = totalRoutes;
        this.totalStops = totalStops;
        this.totalActiveRides = totalActiveRides;
        this.totalNotifications = totalNotifications;
        this.unreadNotifications = unreadNotifications;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public long getTotalParents() {
        return totalParents;
    }

    public long getTotalDrivers() {
        return totalDrivers;
    }

    public long getTotalVehicles() {
        return totalVehicles;
    }

    public long getTotalRoutes() {
        return totalRoutes;
    }

    public long getTotalStops() {
        return totalStops;
    }

    public long getTotalActiveRides() {
        return totalActiveRides;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public long getUnreadNotifications() {
        return unreadNotifications;
    }
}