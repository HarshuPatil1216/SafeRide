package com.saferide.dto;

import java.time.LocalDateTime;

public class RouteResponse {

    private Long id;
    private String routeName;
    private String source;
    private String destination;
    private Double distanceInKm;
    private Integer estimatedDurationInMinutes;
    private Boolean active;
    private LocalDateTime createdAt;

    public RouteResponse() {
    }

    public RouteResponse(
            Long id,
            String routeName,
            String source,
            String destination,
            Double distanceInKm,
            Integer estimatedDurationInMinutes,
            Boolean active,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.routeName = routeName;
        this.source = source;
        this.destination = destination;
        this.distanceInKm = distanceInKm;
        this.estimatedDurationInMinutes =
                estimatedDurationInMinutes;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getRouteName() {
        return routeName;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public Double getDistanceInKm() {
        return distanceInKm;
    }

    public Integer getEstimatedDurationInMinutes() {
        return estimatedDurationInMinutes;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}