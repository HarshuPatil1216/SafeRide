package com.saferide.service;

import com.saferide.dto.CreateDriverRequest;
import com.saferide.dto.DriverResponse;

import java.util.List;

public interface DriverService {

    DriverResponse createDriver(CreateDriverRequest request);

    List<DriverResponse> getAllDrivers();

    DriverResponse getDriverById(Long id);

    DriverResponse updateDriver(
            Long id,
            CreateDriverRequest request
    );

    void deleteDriver(Long id);
}