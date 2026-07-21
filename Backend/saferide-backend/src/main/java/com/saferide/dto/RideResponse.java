package com.saferide.dto;

import com.saferide.enums.RideStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RideResponse {

    private Long id;

    private Long driverId;
    private String driverName;

    private Long vehicleId;
    private String vehicleNumber;

    private String source;
    private String destination;

    private RideStatus status;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
}