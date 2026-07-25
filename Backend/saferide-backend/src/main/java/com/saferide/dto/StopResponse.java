package com.saferide.dto;

import java.time.LocalDateTime;

public class StopResponse {

    private Long id;
    private String stopName;
    private String address;
    private Double latitude;
    private Double longitude;
    private Integer stopOrder;
    private Integer estimatedArrivalMinutes;
    private Boolean active;
    private Long routeId;
    private String routeName;
    private LocalDateTime createdAt;

    public StopResponse() {
    }

    public StopResponse(
            Long id,
            String stopName,
            String address,
            Double latitude,
            Double longitude,
            Integer stopOrder,
            Integer estimatedArrivalMinutes,
            Boolean active,
            Long routeId,
            String routeName,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.stopName = stopName;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.stopOrder = stopOrder;
        this.estimatedArrivalMinutes = estimatedArrivalMinutes;
        this.active = active;
        this.routeId = routeId;
        this.routeName = routeName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getStopName() {
        return stopName;
    }

    public String getAddress() {
        return address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Integer getStopOrder() {
        return stopOrder;
    }

    public Integer getEstimatedArrivalMinutes() {
        return estimatedArrivalMinutes;
    }

    public Boolean getActive() {
        return active;
    }

    public Long getRouteId() {
        return routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}