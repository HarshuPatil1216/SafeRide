package com.saferide.controller;

import com.saferide.enums.RideStatus;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.NotificationRepository;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private StopRepository stopRepository;

    @Mock
    private RideRepository rideRepository;

    @Mock
    private NotificationRepository notificationRepository;

    private DashboardController dashboardController;

    @BeforeEach
    void setUp() {
        dashboardController = new DashboardController(
                studentRepository,
                parentRepository,
                driverRepository,
                vehicleRepository,
                routeRepository,
                stopRepository,
                rideRepository,
                notificationRepository
        );
    }

    @Test
    void getDashboard_shouldReturnAllStatistics() {

        when(studentRepository.count()).thenReturn(10L);
        when(parentRepository.count()).thenReturn(7L);
        when(driverRepository.count()).thenReturn(4L);
        when(vehicleRepository.count()).thenReturn(3L);
        when(routeRepository.count()).thenReturn(5L);
        when(stopRepository.count()).thenReturn(15L);
        when(rideRepository.count()).thenReturn(20L);

        when(rideRepository.countByStatus(RideStatus.COMPLETED))
                .thenReturn(12L);

        when(rideRepository.countByStatus(RideStatus.IN_PROGRESS))
                .thenReturn(3L);

        when(rideRepository.countByStatus(RideStatus.SCHEDULED))
                .thenReturn(5L);

        when(notificationRepository.count()).thenReturn(30L);
        when(notificationRepository.countByReadStatus(false))
                .thenReturn(8L);

        var response =
                dashboardController.getDashboard().getBody();

        assertEquals(10L, response.getTotalStudents());
        assertEquals(7L, response.getTotalParents());
        assertEquals(4L, response.getTotalDrivers());
        assertEquals(3L, response.getTotalVehicles());
        assertEquals(5L, response.getTotalRoutes());
        assertEquals(15L, response.getTotalStops());
        assertEquals(20L, response.getTotalRides());
        assertEquals(12L, response.getCompletedRides());
        assertEquals(3L, response.getRunningRides());
        assertEquals(5L, response.getScheduledRides());
        assertEquals(30L, response.getTotalNotifications());
        assertEquals(8L, response.getUnreadNotifications());
    }
}