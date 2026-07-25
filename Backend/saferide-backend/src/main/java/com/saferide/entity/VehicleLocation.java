package com.saferide.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "vehicle_locations",
        indexes = {
                @Index(
                        name = "idx_vehicle_location_vehicle_id",
                        columnList = "vehicle_id"
                ),
                @Index(
                        name = "idx_vehicle_location_recorded_at",
                        columnList = "recorded_at"
                )
        }
)
public class VehicleLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "vehicle_id",
            nullable = false
    )
    private Vehicle vehicle;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Double speed;

    private Double heading;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(
            name = "recorded_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime recordedAt;

    @PrePersist
    public void prePersist() {
        recordedAt = LocalDateTime.now();

        if (active == null) {
            active = true;
        }
    }

    public VehicleLocation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }
}