package com.saferide.serviceimpl;

import com.saferide.dto.AdminDashboardResponse;
import com.saferide.enums.RideStatus;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.NotificationRepository;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.repository.VehicleRepository;
import com.saferide.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardServiceImpl
        implements DashboardService {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final RideRepository rideRepository;
    private final NotificationRepository notificationRepository;

    public DashboardServiceImpl(
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

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {

        long totalStudents = studentRepository.count();
        long totalParents = parentRepository.count();
        long totalDrivers = driverRepository.count();
        long totalVehicles = vehicleRepository.count();
        long totalRoutes = routeRepository.count();
        long totalStops = stopRepository.count();

        long totalActiveRides =
                rideRepository.countByStatus(
                        RideStatus.IN_PROGRESS
                );

        long totalNotifications =
                notificationRepository.count();

        long unreadNotifications =
                notificationRepository.countByReadStatus(
                        false
                );

        return new AdminDashboardResponse(
                totalStudents,
                totalParents,
                totalDrivers,
                totalVehicles,
                totalRoutes,
                totalStops,
                totalActiveRides,
                totalNotifications,
                unreadNotifications
        );
    }
}