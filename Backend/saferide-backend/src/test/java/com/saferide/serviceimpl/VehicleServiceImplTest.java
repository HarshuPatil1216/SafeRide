package com.saferide.serviceimpl;

import com.saferide.dto.CreateVehicleRequest;
import com.saferide.dto.VehicleResponse;
import com.saferide.entity.Vehicle;
import com.saferide.enums.VehicleStatus;
import com.saferide.enums.VehicleType;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
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
class VehicleServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private CreateVehicleRequest request;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {

        request = new CreateVehicleRequest();
        request.setVehicleNumber("MH12AB1234");
        request.setVehicleType(VehicleType.BUS);
        request.setCapacity(40);
        request.setModel("Starbus");
        request.setManufacturer("Tata");
        request.setStatus(VehicleStatus.ACTIVE);

        vehicle = new Vehicle();
        vehicle.setId(3L);
        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setModel(request.getModel());
        vehicle.setManufacturer(request.getManufacturer());
        vehicle.setStatus(request.getStatus());
        vehicle.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createVehicle_shouldReturnVehicleResponse() {

        when(vehicleRepository.existsByVehicleNumber(
                request.getVehicleNumber()
        )).thenReturn(false);

        when(vehicleRepository.save(any(Vehicle.class)))
                .thenReturn(vehicle);

        VehicleResponse response =
                vehicleService.createVehicle(request);

        assertNotNull(response);
        assertEquals(3L, response.getId());
        assertEquals("MH12AB1234", response.getVehicleNumber());
        assertEquals("Tata", response.getManufacturer());
        assertEquals(VehicleStatus.ACTIVE, response.getStatus());

        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void createVehicle_shouldThrowWhenVehicleNumberAlreadyExists() {

        when(vehicleRepository.existsByVehicleNumber(
                request.getVehicleNumber()
        )).thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> vehicleService.createVehicle(request)
                );

        assertEquals(
                "Vehicle number already exists",
                exception.getMessage()
        );

        verify(vehicleRepository, never())
                .save(any(Vehicle.class));
    }

    @Test
    void getVehicleById_shouldReturnVehicleResponse() {

        when(vehicleRepository.findById(3L))
                .thenReturn(Optional.of(vehicle));

        VehicleResponse response =
                vehicleService.getVehicleById(3L);

        assertNotNull(response);
        assertEquals(3L, response.getId());
        assertEquals("MH12AB1234", response.getVehicleNumber());
    }

    @Test
    void getVehicleById_shouldThrowWhenVehicleNotFound() {

        when(vehicleRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> vehicleService.getVehicleById(999L)
                );

        assertEquals(
                "Vehicle not found",
                exception.getMessage()
        );
    }
}