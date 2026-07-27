package com.saferide.dto;

import com.saferide.enums.StudentRideEventType;

import java.time.LocalDateTime;

public class StudentAttendanceReportResponse {

    private Long eventId;
    private Long studentId;
    private String studentName;
    private Long rideId;
    private StudentRideEventType eventType;
    private Long stopId;
    private String stopName;
    private LocalDateTime eventTime;
    private String remarks;

    public StudentAttendanceReportResponse() {
    }

    public StudentAttendanceReportResponse(
            Long eventId,
            Long studentId,
            String studentName,
            Long rideId,
            StudentRideEventType eventType,
            Long stopId,
            String stopName,
            LocalDateTime eventTime,
            String remarks
    ) {
        this.eventId = eventId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.rideId = rideId;
        this.eventType = eventType;
        this.stopId = stopId;
        this.stopName = stopName;
        this.eventTime = eventTime;
        this.remarks = remarks;
    }

    public Long getEventId() {
        return eventId;
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

    public String getRemarks() {
        return remarks;
    }
}