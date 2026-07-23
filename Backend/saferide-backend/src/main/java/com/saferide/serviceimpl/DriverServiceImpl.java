package com.saferide.serviceimpl;

import com.saferide.dto.CreateDriverRequest;
import com.saferide.dto.DriverResponse;
import com.saferide.entity.Driver;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.DriverRepository;
import com.saferide.service.DriverService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;

    public DriverServiceImpl(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @Override
    public DriverResponse createDriver(CreateDriverRequest request) {

        if (driverRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Driver email already exists"
            );
        }

        if (driverRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException(
                    "Phone number already exists"
            );
        }

        if (driverRepository.existsByLicenseNumber(
                request.getLicenseNumber()
        )) {
            throw new DuplicateResourceException(
                    "License number already exists"
            );
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
    public Page<DriverResponse> getAllDrivers(
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = createSort(sortBy, sortDir);

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        return driverRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<DriverResponse> searchDrivers(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = createSort(sortBy, sortDir);

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        return driverRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        query,
                        query,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    public DriverResponse getDriverById(Long id) {

        Driver driver = driverRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Driver not found"
                        )
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
                        new ResourceNotFoundException(
                                "Driver not found"
                        )
                );

        if (!driver.getEmail().equalsIgnoreCase(request.getEmail())
                && driverRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Driver email already exists"
            );
        }

        if (!driver.getPhone().equals(request.getPhone())
                && driverRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException(
                    "Phone number already exists"
            );
        }

        if (!driver.getLicenseNumber().equalsIgnoreCase(
                request.getLicenseNumber()
        )
                && driverRepository.existsByLicenseNumber(
                request.getLicenseNumber()
        )) {
            throw new DuplicateResourceException(
                    "License number already exists"
            );
        }

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
                        new ResourceNotFoundException(
                                "Driver not found"
                        )
                );

        driverRepository.delete(driver);
    }

    private Sort createSort(
            String sortBy,
            String sortDir
    ) {
        if ("desc".equalsIgnoreCase(sortDir)) {
            return Sort.by(sortBy).descending();
        }

        return Sort.by(sortBy).ascending();
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