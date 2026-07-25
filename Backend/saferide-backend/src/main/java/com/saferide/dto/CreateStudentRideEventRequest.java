package com.saferide.dto;

import com.saferide.enums.StudentRideEventType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateStudentRideEventRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Ride ID is required")
    private Long rideId;

    @NotNull(message = "Event type is required")
    private StudentRideEventType eventType;

    private Long stopId;

    @DecimalMin(value = "-90.0", message = "Latitude must be at least -90")
    @DecimalMax(value = "90.0", message = "Latitude must not exceed 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be at least -180")
    @DecimalMax(value = "180.0", message = "Longitude must not exceed 180")
    private Double longitude;

    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;

    public CreateStudentRideEventRequest() {
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public StudentRideEventType getEventType() {
        return eventType;
    }

    public void setEventType(StudentRideEventType eventType) {
        this.eventType = eventType;
    }

    public Long getStopId() {
        return stopId;
    }

    public void setStopId(Long stopId) {
        this.stopId = stopId;
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