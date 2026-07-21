package com.saferide.dto;

public class DashboardResponse {

    private long totalDrivers;
    private long totalVehicles;
    private long totalRides;
    private long completedRides;
    private long runningRides;
    private long scheduledRides;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalDrivers,
            long totalVehicles,
            long totalRides,
            long completedRides,
            long runningRides,
            long scheduledRides
    ) {
        this.totalDrivers = totalDrivers;
        this.totalVehicles = totalVehicles;
        this.totalRides = totalRides;
        this.completedRides = completedRides;
        this.runningRides = runningRides;
        this.scheduledRides = scheduledRides;
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
}