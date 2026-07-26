package com.saferide.dto;

public class ReportSummaryResponse {

    private long totalRides;
    private long scheduledRides;
    private long inProgressRides;
    private long completedRides;

    private long totalPickupEvents;
    private long totalDropEvents;

    private long totalVehicleLocationRecords;

    private long totalDrivers;
    private long activeDrivers;

    public ReportSummaryResponse() {
    }

    public ReportSummaryResponse(
            long totalRides,
            long scheduledRides,
            long inProgressRides,
            long completedRides,
            long totalPickupEvents,
            long totalDropEvents,
            long totalVehicleLocationRecords,
            long totalDrivers,
            long activeDrivers
    ) {
        this.totalRides = totalRides;
        this.scheduledRides = scheduledRides;
        this.inProgressRides = inProgressRides;
        this.completedRides = completedRides;
        this.totalPickupEvents = totalPickupEvents;
        this.totalDropEvents = totalDropEvents;
        this.totalVehicleLocationRecords = totalVehicleLocationRecords;
        this.totalDrivers = totalDrivers;
        this.activeDrivers = activeDrivers;
    }

    public long getTotalRides() {
        return totalRides;
    }

    public long getScheduledRides() {
        return scheduledRides;
    }

    public long getInProgressRides() {
        return inProgressRides;
    }

    public long getCompletedRides() {
        return completedRides;
    }

    public long getTotalPickupEvents() {
        return totalPickupEvents;
    }

    public long getTotalDropEvents() {
        return totalDropEvents;
    }

    public long getTotalVehicleLocationRecords() {
        return totalVehicleLocationRecords;
    }

    public long getTotalDrivers() {
        return totalDrivers;
    }

    public long getActiveDrivers() {
        return activeDrivers;
    }
}