package com.saferide.dto;

import java.time.LocalDateTime;

public class VehicleLocationReportResponse {

    private Long locationId;
    private Long vehicleId;
    private String vehicleNumber;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private Double heading;
    private LocalDateTime recordedAt;

    public VehicleLocationReportResponse() {
    }

    public VehicleLocationReportResponse(
            Long locationId,
            Long vehicleId,
            String vehicleNumber,
            Double latitude,
            Double longitude,
            Double speed,
            Double heading,
            LocalDateTime recordedAt
    ) {
        this.locationId = locationId;
        this.vehicleId = vehicleId;
        this.vehicleNumber = vehicleNumber;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.heading = heading;
        this.recordedAt = recordedAt;
    }

    public Long getLocationId() {
        return locationId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Double getSpeed() {
        return speed;
    }

    public Double getHeading() {
        return heading;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }
}