package com.saferide.dto;

import com.saferide.enums.VehicleStatus;
import com.saferide.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class VehicleResponse {

    private Long id;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private Integer capacity;
    private String model;
    private String manufacturer;
    private VehicleStatus status;
    private LocalDateTime createdAt;
}