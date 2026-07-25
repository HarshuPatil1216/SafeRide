package com.saferide.service;

import com.saferide.dto.UpdateVehicleLocationRequest;
import com.saferide.dto.VehicleLocationResponse;
import org.springframework.data.domain.Page;

public interface VehicleLocationService {

    VehicleLocationResponse updateLocation(
            UpdateVehicleLocationRequest request
    );

    VehicleLocationResponse getLatestLocation(
            Long vehicleId
    );

    Page<VehicleLocationResponse> getLocationHistory(
            Long vehicleId,
            int page,
            int size
    );
}