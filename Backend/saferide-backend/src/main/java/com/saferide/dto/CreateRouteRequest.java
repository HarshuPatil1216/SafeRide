package com.saferide.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateRouteRequest {

    @NotBlank(message = "Route name is required")
    private String routeName;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Distance is required")
    @DecimalMin(
            value = "0.1",
            message = "Distance must be greater than 0"
    )
    private Double distanceInKm;

    @NotNull(message = "Estimated duration is required")
    @Min(
            value = 1,
            message = "Estimated duration must be at least 1 minute"
    )
    private Integer estimatedDurationInMinutes;

    private Boolean active = true;

    public CreateRouteRequest() {
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Double getDistanceInKm() {
        return distanceInKm;
    }

    public void setDistanceInKm(Double distanceInKm) {
        this.distanceInKm = distanceInKm;
    }

    public Integer getEstimatedDurationInMinutes() {
        return estimatedDurationInMinutes;
    }

    public void setEstimatedDurationInMinutes(
            Integer estimatedDurationInMinutes
    ) {
        this.estimatedDurationInMinutes =
                estimatedDurationInMinutes;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}