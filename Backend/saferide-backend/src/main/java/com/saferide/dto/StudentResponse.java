package com.saferide.dto;

import java.time.LocalDateTime;

public class StudentResponse {

    private Long id;
    private String fullName;
    private String rollNumber;
    private String standard;
    private String division;

    private Long parentId;
    private String parentName;
    private String parentPhone;

    private Long routeId;
    private String routeName;

    private Long stopId;
    private String stopName;

    private String address;
    private Boolean active;
    private LocalDateTime createdAt;

    public StudentResponse() {
    }

    public StudentResponse(
            Long id,
            String fullName,
            String rollNumber,
            String standard,
            String division,
            Long parentId,
            String parentName,
            String parentPhone,
            Long routeId,
            String routeName,
            Long stopId,
            String stopName,
            String address,
            Boolean active,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.fullName = fullName;
        this.rollNumber = rollNumber;
        this.standard = standard;
        this.division = division;
        this.parentId = parentId;
        this.parentName = parentName;
        this.parentPhone = parentPhone;
        this.routeId = routeId;
        this.routeName = routeName;
        this.stopId = stopId;
        this.stopName = stopName;
        this.address = address;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public String getStandard() {
        return standard;
    }

    public String getDivision() {
        return division;
    }

    public Long getParentId() {
        return parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public String getParentPhone() {
        return parentPhone;
    }

    public Long getRouteId() {
        return routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public Long getStopId() {
        return stopId;
    }

    public String getStopName() {
        return stopName;
    }

    public String getAddress() {
        return address;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}