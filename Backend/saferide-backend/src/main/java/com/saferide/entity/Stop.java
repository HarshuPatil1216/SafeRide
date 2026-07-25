package com.saferide.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "stops",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_route_stop_name",
                        columnNames = {"route_id", "stop_name"}
                ),
                @UniqueConstraint(
                        name = "uk_route_stop_order",
                        columnNames = {"route_id", "stop_order"}
                )
        }
)
public class Stop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "stop_name",
            nullable = false
    )
    private String stopName;

    @Column(nullable = false)
    private String address;

    private Double latitude;

    private Double longitude;

    @Column(
            name = "stop_order",
            nullable = false
    )
    private Integer stopOrder;

    @Column(
            name = "estimated_arrival_minutes",
            nullable = false
    )
    private Integer estimatedArrivalMinutes;

    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "route_id",
            nullable = false
    )
    private Route route;

    @Column(
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (active == null) {
            active = true;
        }
    }

    public Stop() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStopName() {
        return stopName;
    }

    public void setStopName(String stopName) {
        this.stopName = stopName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public Integer getStopOrder() {
        return stopOrder;
    }

    public void setStopOrder(Integer stopOrder) {
        this.stopOrder = stopOrder;
    }

    public Integer getEstimatedArrivalMinutes() {
        return estimatedArrivalMinutes;
    }

    public void setEstimatedArrivalMinutes(
            Integer estimatedArrivalMinutes
    ) {
        this.estimatedArrivalMinutes =
                estimatedArrivalMinutes;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}