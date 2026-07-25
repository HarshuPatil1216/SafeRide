package com.saferide.entity;

import com.saferide.enums.StudentRideEventType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "student_ride_events",
        indexes = {
                @Index(
                        name = "idx_student_ride_event_student_id",
                        columnList = "student_id"
                ),
                @Index(
                        name = "idx_student_ride_event_ride_id",
                        columnList = "ride_id"
                ),
                @Index(
                        name = "idx_student_ride_event_time",
                        columnList = "event_time"
                )
        }
)
public class StudentRideEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "ride_id",
            nullable = false
    )
    private Ride ride;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "event_type",
            nullable = false,
            length = 30
    )
    private StudentRideEventType eventType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id")
    private Stop stop;

    @Column(
            name = "event_time",
            nullable = false,
            updatable = false
    )
    private LocalDateTime eventTime;

    private Double latitude;

    private Double longitude;

    @Column(length = 500)
    private String remarks;

    @PrePersist
    public void prePersist() {
        if (eventTime == null) {
            eventTime = LocalDateTime.now();
        }
    }

    public StudentRideEvent() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Ride getRide() {
        return ride;
    }

    public void setRide(Ride ride) {
        this.ride = ride;
    }

    public StudentRideEventType getEventType() {
        return eventType;
    }

    public void setEventType(
            StudentRideEventType eventType
    ) {
        this.eventType = eventType;
    }

    public Stop getStop() {
        return stop;
    }

    public void setStop(Stop stop) {
        this.stop = stop;
    }

    public LocalDateTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalDateTime eventTime) {
        this.eventTime = eventTime;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}