package com.saferide.dto;

import com.saferide.enums.VehicleStatus;
import com.saferide.enums.VehicleType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateVehicleRequest {

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Manufacturer is required")
    private String manufacturer;

    private VehicleStatus status;
}