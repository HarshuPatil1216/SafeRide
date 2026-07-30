package com.saferide.controller;

import com.saferide.dto.DashboardResponse;
import com.saferide.enums.RideStatus;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.NotificationRepository;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.repository.VehicleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final RideRepository rideRepository;
    private final NotificationRepository notificationRepository;

    public DashboardController(
            StudentRepository studentRepository,
            ParentRepository parentRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository,
            RouteRepository routeRepository,
            StopRepository stopRepository,
            RideRepository rideRepository,
            NotificationRepository notificationRepository
    ) {
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.rideRepository = rideRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        DashboardResponse response = new DashboardResponse(
                studentRepository.count(),
                parentRepository.count(),
                driverRepository.count(),
                vehicleRepository.count(),
                routeRepository.count(),
                stopRepository.count(),
                rideRepository.count(),
                rideRepository.countByStatus(RideStatus.COMPLETED),
                rideRepository.countByStatus(RideStatus.IN_PROGRESS),
                rideRepository.countByStatus(RideStatus.SCHEDULED),
                notificationRepository.count(),
                notificationRepository.countByReadStatus(false)
        );

        return ResponseEntity.ok(response);
    }
}