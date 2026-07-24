package com.saferide.dto;

import java.time.LocalDateTime;

public class StudentResponse {

    private Long id;
    private String fullName;
    private String rollNumber;
    private String standard;
    private String division;
    private String parentName;
    private String parentPhone;
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
            String parentName,
            String parentPhone,
            String address,
            Boolean active,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.fullName = fullName;
        this.rollNumber = rollNumber;
        this.standard = standard;
        this.division = division;
        this.parentName = parentName;
        this.parentPhone = parentPhone;
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

    public String getParentName() {
        return parentName;
    }

    public String getParentPhone() {
        return parentPhone;
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