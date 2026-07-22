package com.saferide.service;

import com.saferide.dto.CreateDriverRequest;
import com.saferide.dto.DriverResponse;
import org.springframework.data.domain.Page;

public interface DriverService {

    DriverResponse createDriver(CreateDriverRequest request);

    Page<DriverResponse> getAllDrivers(
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    Page<DriverResponse> searchDrivers(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    DriverResponse getDriverById(Long id);

    DriverResponse updateDriver(
            Long id,
            CreateDriverRequest request
    );

    void deleteDriver(Long id);
}