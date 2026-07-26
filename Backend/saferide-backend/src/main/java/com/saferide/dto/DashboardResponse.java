package com.saferide.dto;

public class DashboardResponse {

    private long totalStudents;
    private long totalParents;
    private long totalDrivers;
    private long totalVehicles;
    private long totalRoutes;
    private long totalStops;

    private long totalRides;
    private long completedRides;
    private long runningRides;
    private long scheduledRides;

    private long totalNotifications;
    private long unreadNotifications;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalStudents,
            long totalParents,
            long totalDrivers,
            long totalVehicles,
            long totalRoutes,
            long totalStops,
            long totalRides,
            long completedRides,
            long runningRides,
            long scheduledRides,
            long totalNotifications,
            long unreadNotifications
    ) {
        this.totalStudents = totalStudents;
        this.totalParents = totalParents;
        this.totalDrivers = totalDrivers;
        this.totalVehicles = totalVehicles;
        this.totalRoutes = totalRoutes;
        this.totalStops = totalStops;
        this.totalRides = totalRides;
        this.completedRides = completedRides;
        this.runningRides = runningRides;
        this.scheduledRides = scheduledRides;
        this.totalNotifications = totalNotifications;
        this.unreadNotifications = unreadNotifications;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalParents() {
        return totalParents;
    }

    public void setTotalParents(long totalParents) {
        this.totalParents = totalParents;
    }

    public long getTotalDrivers() {
        return totalDrivers;
    }

    public void setTotalDrivers(long totalDrivers) {
        this.totalDrivers = totalDrivers;
    }

    public long getTotalVehicles() {
        return totalVehicles;
    }

    public void setTotalVehicles(long totalVehicles) {
        this.totalVehicles = totalVehicles;
    }

    public long getTotalRoutes() {
        return totalRoutes;
    }

    public void setTotalRoutes(long totalRoutes) {
        this.totalRoutes = totalRoutes;
    }

    public long getTotalStops() {
        return totalStops;
    }

    public void setTotalStops(long totalStops) {
        this.totalStops = totalStops;
    }

    public long getTotalRides() {
        return totalRides;
    }

    public void setTotalRides(long totalRides) {
        this.totalRides = totalRides;
    }

    public long getCompletedRides() {
        return completedRides;
    }

    public void setCompletedRides(long completedRides) {
        this.completedRides = completedRides;
    }

    public long getRunningRides() {
        return runningRides;
    }

    public void setRunningRides(long runningRides) {
        this.runningRides = runningRides;
    }

    public long getScheduledRides() {
        return scheduledRides;
    }

    public void setScheduledRides(long scheduledRides) {
        this.scheduledRides = scheduledRides;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

    public long getUnreadNotifications() {
        return unreadNotifications;
    }

    public void setUnreadNotifications(long unreadNotifications) {
        this.unreadNotifications = unreadNotifications;
    }
}