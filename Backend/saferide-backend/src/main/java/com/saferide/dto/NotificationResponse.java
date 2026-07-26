package com.saferide.dto;

import com.saferide.enums.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;

    private Long parentId;
    private String parentName;

    private Long studentId;
    private String studentName;

    private Long rideId;

    private NotificationType type;
    private String title;
    private String message;
    private Boolean readStatus;
    private LocalDateTime createdAt;

    public NotificationResponse() {
    }

    public NotificationResponse(
            Long id,
            Long parentId,
            String parentName,
            Long studentId,
            String studentName,
            Long rideId,
            NotificationType type,
            String title,
            String message,
            Boolean readStatus,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.parentId = parentId;
        this.parentName = parentName;
        this.studentId = studentId;
        this.studentName = studentName;
        this.rideId = rideId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.readStatus = readStatus;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getParentId() {
        return parentId;
    }

    public String getParentName() {
        return parentName;
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

    public NotificationType getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public Boolean getReadStatus() {
        return readStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}