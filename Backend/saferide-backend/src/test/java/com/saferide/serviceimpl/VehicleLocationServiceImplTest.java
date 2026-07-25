package com.saferide.serviceimpl;

import com.saferide.dto.UpdateVehicleLocationRequest;
import com.saferide.dto.VehicleLocationResponse;
import com.saferide.entity.Vehicle;
import com.saferide.entity.VehicleLocation;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.VehicleLocationRepository;
import com.saferide.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleLocationServiceImplTest {

    @Mock
    private VehicleLocationRepository vehicleLocationRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleLocationServiceImpl vehicleLocationService;

    private UpdateVehicleLocationRequest request;
    private Vehicle vehicle;
    private VehicleLocation location;

    @BeforeEach
    void setUp() {

        request = new UpdateVehicleLocationRequest();
        request.setVehicleId(3L);
        request.setLatitude(18.5204);
        request.setLongitude(73.8567);
        request.setSpeed(42.5);
        request.setHeading(90.0);

        vehicle = new Vehicle();
        vehicle.setId(3L);
        vehicle.setVehicleNumber("MH12AB1234");

        location = new VehicleLocation();
        location.setId(1L);
        location.setVehicle(vehicle);
        location.setLatitude(18.5204);
        location.setLongitude(73.8567);
        location.setSpeed(42.5);
        location.setHeading(90.0);
        location.setActive(true);
    }

    @Test
    void updateLocation_shouldReturnVehicleLocationResponse() {

        when(vehicleRepository.findById(3L))
                .thenReturn(Optional.of(vehicle));

        when(vehicleLocationRepository.save(
                any(VehicleLocation.class)
        )).thenReturn(location);

        VehicleLocationResponse response =
                vehicleLocationService.updateLocation(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(3L, response.getVehicleId());
        assertEquals(
                "MH12AB1234",
                response.getVehicleNumber()
        );
        assertEquals(18.5204, response.getLatitude());
        assertEquals(73.8567, response.getLongitude());
        assertEquals(42.5, response.getSpeed());
        assertEquals(90.0, response.getHeading());
        assertTrue(response.getActive());

        verify(vehicleRepository).findById(3L);

        verify(vehicleLocationRepository)
                .save(any(VehicleLocation.class));
    }

    @Test
    void updateLocation_shouldThrowWhenVehicleNotFound() {

        when(vehicleRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setVehicleId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> vehicleLocationService
                                .updateLocation(request)
                );

        assertEquals(
                "Vehicle not found",
                exception.getMessage()
        );

        verify(vehicleLocationRepository, never())
                .save(any(VehicleLocation.class));
    }

    @Test
    void getLatestLocation_shouldReturnLatestLocation() {

        when(vehicleLocationRepository
                .findTopByVehicleIdOrderByRecordedAtDesc(3L))
                .thenReturn(Optional.of(location));

        VehicleLocationResponse response =
                vehicleLocationService.getLatestLocation(3L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(3L, response.getVehicleId());
        assertEquals(18.5204, response.getLatitude());
        assertEquals(73.8567, response.getLongitude());
    }

    @Test
    void getLatestLocation_shouldThrowWhenLocationNotFound() {

        when(vehicleLocationRepository
                .findTopByVehicleIdOrderByRecordedAtDesc(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> vehicleLocationService
                                .getLatestLocation(999L)
                );

        assertEquals(
                "Vehicle location not found",
                exception.getMessage()
        );
    }

    @Test
    void getLocationHistory_shouldReturnPagedLocations() {

        Page<VehicleLocation> locationPage =
                new PageImpl<>(List.of(location));

        when(vehicleLocationRepository
                .findByVehicleIdOrderByRecordedAtDesc(
                        eq(3L),
                        any(Pageable.class)
                ))
                .thenReturn(locationPage);

        Page<VehicleLocationResponse> response =
                vehicleLocationService.getLocationHistory(
                        3L,
                        0,
                        10
                );

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
        assertEquals(
                "MH12AB1234",
                response.getContent()
                        .getFirst()
                        .getVehicleNumber()
        );

        verify(vehicleLocationRepository)
                .findByVehicleIdOrderByRecordedAtDesc(
                        eq(3L),
                        any(Pageable.class)
                );
    }
}