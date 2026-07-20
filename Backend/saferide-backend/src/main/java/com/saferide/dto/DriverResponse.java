package com.saferide.dto;

import com.saferide.enums.DriverStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DriverResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String licenseNumber;
    private Integer experience;
    private DriverStatus status;
    private LocalDateTime createdAt;

}