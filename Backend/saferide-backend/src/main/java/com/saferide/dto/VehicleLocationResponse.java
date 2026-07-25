package com.saferide.dto;

import java.time.LocalDateTime;

public class VehicleLocationResponse {

    private Long id;
    private Long vehicleId;
    private String vehicleNumber;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private Double heading;
    private Boolean active;
    private LocalDateTime recordedAt;

    public VehicleLocationResponse() {
    }

    public VehicleLocationResponse(
            Long id,
            Long vehicleId,
            String vehicleNumber,
            Double latitude,
            Double longitude,
            Double speed,
            Double heading,
            Boolean active,
            LocalDateTime recordedAt
    ) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.vehicleNumber = vehicleNumber;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.heading = heading;
        this.active = active;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
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

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }
}