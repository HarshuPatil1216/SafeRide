package com.saferide.serviceimpl;

import com.saferide.dto.CreateDriverRequest;
import com.saferide.dto.DriverResponse;
import com.saferide.entity.Driver;
import com.saferide.enums.DriverStatus;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.DriverRepository;
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
class DriverServiceImplTest {

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private DriverServiceImpl driverService;

    private CreateDriverRequest request;
    private Driver driver;

    @BeforeEach
    void setUp() {

        request = new CreateDriverRequest();
        request.setFullName("Ramesh Patil");
        request.setEmail("ramesh@gmail.com");
        request.setPhone("9876543210");
        request.setLicenseNumber("MH123456789");
        request.setExperience(5);
        request.setStatus(DriverStatus.ACTIVE);

        driver = new Driver();
        driver.setId(3L);
        driver.setFullName(request.getFullName());
        driver.setEmail(request.getEmail());
        driver.setPhone(request.getPhone());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setExperience(request.getExperience());
        driver.setStatus(request.getStatus());
        driver.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createDriver_shouldReturnDriverResponse() {

        when(driverRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);

        when(driverRepository.existsByPhone(request.getPhone()))
                .thenReturn(false);

        when(driverRepository.existsByLicenseNumber(
                request.getLicenseNumber()
        )).thenReturn(false);

        when(driverRepository.save(any(Driver.class)))
                .thenReturn(driver);

        DriverResponse response =
                driverService.createDriver(request);

        assertNotNull(response);
        assertEquals(3L, response.getId());
        assertEquals("Ramesh Patil", response.getFullName());
        assertEquals("ramesh@gmail.com", response.getEmail());
        assertEquals(DriverStatus.ACTIVE, response.getStatus());

        verify(driverRepository).save(any(Driver.class));
    }

    @Test
    void createDriver_shouldThrowWhenEmailAlreadyExists() {

        when(driverRepository.existsByEmail(request.getEmail()))
                .thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> driverService.createDriver(request)
                );

        assertEquals(
                "Driver email already exists",
                exception.getMessage()
        );

        verify(driverRepository, never())
                .save(any(Driver.class));
    }

    @Test
    void getDriverById_shouldReturnDriverResponse() {

        when(driverRepository.findById(3L))
                .thenReturn(Optional.of(driver));

        DriverResponse response =
                driverService.getDriverById(3L);

        assertNotNull(response);
        assertEquals(3L, response.getId());
        assertEquals("Ramesh Patil", response.getFullName());
    }

    @Test
    void getDriverById_shouldThrowWhenDriverNotFound() {

        when(driverRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> driverService.getDriverById(999L)
                );

        assertEquals(
                "Driver not found",
                exception.getMessage()
        );
    }
}