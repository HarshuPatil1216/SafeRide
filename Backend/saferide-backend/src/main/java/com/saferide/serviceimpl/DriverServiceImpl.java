package com.saferide.serviceimpl;

import com.saferide.dto.CreateDriverRequest;
import com.saferide.dto.DriverResponse;
import com.saferide.entity.Driver;
import com.saferide.repository.DriverRepository;
import com.saferide.service.DriverService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;

    public DriverServiceImpl(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @Override
    public DriverResponse createDriver(CreateDriverRequest request) {

        if (driverRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Driver email already exists");
        }

        if (driverRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }

        Driver driver = new Driver();
        driver.setFullName(request.getFullName());
        driver.setEmail(request.getEmail());
        driver.setPhone(request.getPhone());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setExperience(request.getExperience());
        driver.setStatus(request.getStatus());

        Driver savedDriver = driverRepository.save(driver);

        return mapToResponse(savedDriver);
    }

    @Override
    public List<DriverResponse> getAllDrivers() {

        return driverRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DriverResponse getDriverById(Long id) {

        Driver driver = driverRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Driver not found")
                );

        return mapToResponse(driver);
    }

    @Override
    public DriverResponse updateDriver(
            Long id,
            CreateDriverRequest request
    ) {

        Driver driver = driverRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Driver not found")
                );

        driver.setFullName(request.getFullName());
        driver.setEmail(request.getEmail());
        driver.setPhone(request.getPhone());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setExperience(request.getExperience());
        driver.setStatus(request.getStatus());

        Driver updatedDriver = driverRepository.save(driver);

        return mapToResponse(updatedDriver);
    }

    @Override
    public void deleteDriver(Long id) {

        Driver driver = driverRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Driver not found")
                );

        driverRepository.delete(driver);
    }

    private DriverResponse mapToResponse(Driver driver) {

        return new DriverResponse(
                driver.getId(),
                driver.getFullName(),
                driver.getEmail(),
                driver.getPhone(),
                driver.getLicenseNumber(),
                driver.getExperience(),
                driver.getStatus(),
                driver.getCreatedAt()
        );
    }
}