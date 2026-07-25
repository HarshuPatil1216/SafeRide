package com.saferide.dto;

import com.saferide.enums.StudentRideEventType;

import java.time.LocalDateTime;

public class StudentRideEventResponse {

    private Long id;

    private Long studentId;
    private String studentName;

    private Long rideId;
    private StudentRideEventType eventType;

    private Long stopId;
    private String stopName;

    private LocalDateTime eventTime;
    private Double latitude;
    private Double longitude;
    private String remarks;

    public StudentRideEventResponse() {
    }

    public StudentRideEventResponse(
            Long id,
            Long studentId,
            String studentName,
            Long rideId,
            StudentRideEventType eventType,
            Long stopId,
            String stopName,
            LocalDateTime eventTime,
            Double latitude,
            Double longitude,
            String remarks
    ) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.rideId = rideId;
        this.eventType = eventType;
        this.stopId = stopId;
        this.stopName = stopName;
        this.eventTime = eventTime;
        this.latitude = latitude;
        this.longitude = longitude;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public Long getRideId() {
        return rideId;
    }

    public StudentRideEventType getEventType() {
        return eventType;
    }

    public Long getStopId() {
        return stopId;
    }

    public String getStopName() {
        return stopName;
    }

    public LocalDateTime getEventTime() {
        return eventTime;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public String getRemarks() {
        return remarks;
    }
}