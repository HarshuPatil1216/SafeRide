package com.saferide.serviceimpl;

import com.saferide.dto.RideResponse;
import com.saferide.entity.Driver;
import com.saferide.entity.Ride;
import com.saferide.entity.Vehicle;
import com.saferide.enums.RideStatus;
import com.saferide.repository.RideRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceImplTest {

    @Mock
    private RideRepository rideRepository;

    @InjectMocks
    private ReportServiceImpl reportService;

    private Ride completedRide;
    private Ride runningRide;
    private Ride scheduledRide;

    @BeforeEach
    void setUp() {

        Driver driver = new Driver();
        driver.setId(3L);
        driver.setFullName("Ramesh Patil");

        Vehicle vehicle = new Vehicle();
        vehicle.setId(3L);
        vehicle.setVehicleNumber("MH12AB1234");

        completedRide = createRide(
                1L,
                driver,
                vehicle,
                RideStatus.COMPLETED
        );

        runningRide = createRide(
                2L,
                driver,
                vehicle,
                RideStatus.IN_PROGRESS
        );

        scheduledRide = createRide(
                3L,
                driver,
                vehicle,
                RideStatus.SCHEDULED
        );
    }

    @Test
    void getAllRides_shouldReturnAllRides() {

        when(rideRepository.findAll())
                .thenReturn(
                        List.of(
                                completedRide,
                                runningRide,
                                scheduledRide
                        )
                );

        List<RideResponse> response =
                reportService.getAllRides();

        assertNotNull(response);
        assertEquals(3, response.size());
        assertEquals(
                RideStatus.COMPLETED,
                response.get(0).getStatus()
        );
        assertEquals(
                RideStatus.IN_PROGRESS,
                response.get(1).getStatus()
        );
        assertEquals(
                RideStatus.SCHEDULED,
                response.get(2).getStatus()
        );
    }

    @Test
    void getCompletedRides_shouldReturnCompletedRides() {

        when(rideRepository.findByStatus(
                RideStatus.COMPLETED
        )).thenReturn(List.of(completedRide));

        List<RideResponse> response =
                reportService.getCompletedRides();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(
                RideStatus.COMPLETED,
                response.getFirst().getStatus()
        );
    }

    @Test
    void getRunningRides_shouldReturnRunningRides() {

        when(rideRepository.findByStatus(
                RideStatus.IN_PROGRESS
        )).thenReturn(List.of(runningRide));

        List<RideResponse> response =
                reportService.getRunningRides();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(
                RideStatus.IN_PROGRESS,
                response.getFirst().getStatus()
        );
    }

    @Test
    void getScheduledRides_shouldReturnScheduledRides() {

        when(rideRepository.findByStatus(
                RideStatus.SCHEDULED
        )).thenReturn(List.of(scheduledRide));

        List<RideResponse> response =
                reportService.getScheduledRides();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(
                RideStatus.SCHEDULED,
                response.getFirst().getStatus()
        );
    }

    @Test
    void getAllRides_shouldReturnEmptyList_WhenNoRidesExist() {

        when(rideRepository.findAll())
                .thenReturn(List.of());

        List<RideResponse> response =
                reportService.getAllRides();

        assertNotNull(response);
        assertTrue(response.isEmpty());
    }

    private Ride createRide(
            Long id,
            Driver driver,
            Vehicle vehicle,
            RideStatus status
    ) {

        Ride ride = new Ride();
        ride.setId(id);
        ride.setDriver(driver);
        ride.setVehicle(vehicle);
        ride.setSource("Pune Station");
        ride.setDestination("SafeRide School");
        ride.setStatus(status);

        return ride;
    }
}