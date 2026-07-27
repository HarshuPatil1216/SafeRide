package com.saferide.dto;

import com.saferide.enums.RideStatus;

import java.time.LocalDateTime;

public class RideReportResponse {

    private Long rideId;

    private Long driverId;
    private String driverName;

    private Long vehicleId;
    private String vehicleNumber;

    private String source;
    private String destination;

    private RideStatus status;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;

    public RideReportResponse() {
    }

    public RideReportResponse(
            Long rideId,
            Long driverId,
            String driverName,
            Long vehicleId,
            String vehicleNumber,
            String source,
            String destination,
            RideStatus status,
            LocalDateTime startTime,
            LocalDateTime endTime,
            LocalDateTime createdAt
    ) {
        this.rideId = rideId;
        this.driverId = driverId;
        this.driverName = driverName;
        this.vehicleId = vehicleId;
        this.vehicleNumber = vehicleNumber;
        this.source = source;
        this.destination = destination;
        this.status = status;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = createdAt;
    }

    public Long getRideId() {
        return rideId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public RideStatus getStatus() {
        return status;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}