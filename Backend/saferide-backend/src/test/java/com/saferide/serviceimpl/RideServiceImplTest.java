package com.saferide.serviceimpl;

import com.saferide.dto.CreateRideRequest;
import com.saferide.dto.RideResponse;
import com.saferide.entity.Driver;
import com.saferide.entity.Ride;
import com.saferide.entity.Vehicle;
import com.saferide.enums.RideStatus;
import com.saferide.exception.InvalidRideStateException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RideServiceImplTest {

    @Mock
    private RideRepository rideRepository;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private RideServiceImpl rideService;

    private CreateRideRequest request;
    private Driver driver;
    private Vehicle vehicle;
    private Ride ride;

    @BeforeEach
    void setUp() {

        request = new CreateRideRequest();
        request.setDriverId(3L);
        request.setVehicleId(3L);
        request.setSource("Pune Station");
        request.setDestination("Mumbai Airport");

        driver = new Driver();
        driver.setId(3L);
        driver.setFullName("Ramesh Patil");

        vehicle = new Vehicle();
        vehicle.setId(3L);
        vehicle.setVehicleNumber("MH12AB1234");

        ride = new Ride();
        ride.setId(1L);
        ride.setDriver(driver);
        ride.setVehicle(vehicle);
        ride.setSource("Pune Station");
        ride.setDestination("Mumbai Airport");
        ride.setStatus(RideStatus.SCHEDULED);
        ride.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createRide_shouldReturnRideResponse() {

        when(driverRepository.findById(3L))
                .thenReturn(Optional.of(driver));

        when(vehicleRepository.findById(3L))
                .thenReturn(Optional.of(vehicle));

        when(rideRepository.save(any(Ride.class)))
                .thenReturn(ride);

        RideResponse response = rideService.createRide(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(3L, response.getDriverId());
        assertEquals("Ramesh Patil", response.getDriverName());
        assertEquals(3L, response.getVehicleId());
        assertEquals("MH12AB1234", response.getVehicleNumber());
        assertEquals("Pune Station", response.getSource());
        assertEquals("Mumbai Airport", response.getDestination());
        assertEquals(RideStatus.SCHEDULED, response.getStatus());

        verify(rideRepository).save(any(Ride.class));
    }

    @Test
    void createRide_shouldThrowWhenDriverNotFound() {

        when(driverRepository.findById(3L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> rideService.createRide(request)
                );

        assertEquals(
                "Driver not found",
                exception.getMessage()
        );

        verify(vehicleRepository, never())
                .findById(anyLong());

        verify(rideRepository, never())
                .save(any(Ride.class));
    }

    @Test
    void createRide_shouldThrowWhenVehicleNotFound() {

        when(driverRepository.findById(3L))
                .thenReturn(Optional.of(driver));

        when(vehicleRepository.findById(3L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> rideService.createRide(request)
                );

        assertEquals(
                "Vehicle not found",
                exception.getMessage()
        );

        verify(rideRepository, never())
                .save(any(Ride.class));
    }

    @Test
    void startRide_shouldChangeStatusToInProgress() {

        when(rideRepository.findById(1L))
                .thenReturn(Optional.of(ride));

        when(rideRepository.save(any(Ride.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        RideResponse response = rideService.startRide(1L);

        assertNotNull(response);
        assertEquals(
                RideStatus.IN_PROGRESS,
                response.getStatus()
        );
        assertNotNull(response.getStartTime());

        verify(rideRepository).save(ride);
    }

    @Test
    void startRide_shouldThrowWhenRideIsNotScheduled() {

        ride.setStatus(RideStatus.COMPLETED);

        when(rideRepository.findById(1L))
                .thenReturn(Optional.of(ride));

        InvalidRideStateException exception =
                assertThrows(
                        InvalidRideStateException.class,
                        () -> rideService.startRide(1L)
                );

        assertEquals(
                "Only scheduled ride can be started",
                exception.getMessage()
        );

        verify(rideRepository, never())
                .save(any(Ride.class));
    }

    @Test
    void endRide_shouldChangeStatusToCompleted() {

        ride.setStatus(RideStatus.IN_PROGRESS);
        ride.setStartTime(LocalDateTime.now());

        when(rideRepository.findById(1L))
                .thenReturn(Optional.of(ride));

        when(rideRepository.save(any(Ride.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        RideResponse response = rideService.endRide(1L);

        assertNotNull(response);
        assertEquals(
                RideStatus.COMPLETED,
                response.getStatus()
        );
        assertNotNull(response.getEndTime());

        verify(rideRepository).save(ride);
    }

    @Test
    void endRide_shouldThrowWhenRideIsNotInProgress() {

        ride.setStatus(RideStatus.SCHEDULED);

        when(rideRepository.findById(1L))
                .thenReturn(Optional.of(ride));

        InvalidRideStateException exception =
                assertThrows(
                        InvalidRideStateException.class,
                        () -> rideService.endRide(1L)
                );

        assertEquals(
                "Only in-progress ride can be completed",
                exception.getMessage()
        );

        verify(rideRepository, never())
                .save(any(Ride.class));
    }

    @Test
    void getRideById_shouldThrowWhenRideNotFound() {

        when(rideRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> rideService.getRideById(999L)
                );

        assertEquals(
                "Ride not found",
                exception.getMessage()
        );
    }
}