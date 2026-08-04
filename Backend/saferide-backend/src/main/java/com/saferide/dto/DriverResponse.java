package com.saferide.dto;

import com.saferide.enums.DriverStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String licenseNumber;

    private Integer experience;

    private Long vehicleId;

    private String vehicleNumber;

    private String address;

    private DriverStatus status;

    private Boolean active;

    private LocalDateTime createdAt;

}