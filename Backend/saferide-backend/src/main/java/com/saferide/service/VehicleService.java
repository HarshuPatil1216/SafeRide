package com.saferide.service;

import com.saferide.dto.CreateVehicleRequest;
import com.saferide.dto.VehicleResponse;
import org.springframework.data.domain.Page;

public interface VehicleService {

    VehicleResponse createVehicle(CreateVehicleRequest request);

    Page<VehicleResponse> getAllVehicles(
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    Page<VehicleResponse> searchVehicles(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    VehicleResponse getVehicleById(Long id);

    VehicleResponse updateVehicle(
            Long id,
            CreateVehicleRequest request
    );

    void deleteVehicle(Long id);
}