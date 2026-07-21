package com.saferide.controller;

import com.saferide.dto.DashboardResponse;
import com.saferide.enums.RideStatus;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.VehicleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final RideRepository rideRepository;

    public DashboardController(
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository,
            RideRepository rideRepository
    ) {
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.rideRepository = rideRepository;
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        DashboardResponse response = new DashboardResponse(
                driverRepository.count(),
                vehicleRepository.count(),
                rideRepository.count(),
                rideRepository.countByStatus(RideStatus.COMPLETED),
                rideRepository.countByStatus(RideStatus.IN_PROGRESS),
                rideRepository.countByStatus(RideStatus.SCHEDULED)
        );

        return ResponseEntity.ok(response);
    }
}