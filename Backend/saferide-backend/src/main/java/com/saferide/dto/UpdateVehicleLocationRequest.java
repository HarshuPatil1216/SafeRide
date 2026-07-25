package com.saferide.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class UpdateVehicleLocationRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Latitude is required")
    @DecimalMin(
            value = "-90.0",
            message = "Latitude must be at least -90"
    )
    @DecimalMax(
            value = "90.0",
            message = "Latitude must not exceed 90"
    )
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(
            value = "-180.0",
            message = "Longitude must be at least -180"
    )
    @DecimalMax(
            value = "180.0",
            message = "Longitude must not exceed 180"
    )
    private Double longitude;

    @DecimalMin(
            value = "0.0",
            message = "Speed cannot be negative"
    )
    private Double speed;

    @DecimalMin(
            value = "0.0",
            message = "Heading must be at least 0"
    )
    @DecimalMax(
            value = "360.0",
            message = "Heading must not exceed 360"
    )
    private Double heading;

    public UpdateVehicleLocationRequest() {
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public Double getHeading() {
        return heading;
    }

    public void setHeading(Double heading) {
        this.heading = heading;
    }
}