package com.saferide.service;

import com.saferide.dto.CreateVehicleRequest;
import com.saferide.dto.VehicleResponse;

import java.util.List;

public interface VehicleService {

    VehicleResponse createVehicle(CreateVehicleRequest request);

    List<VehicleResponse> getAllVehicles();

    VehicleResponse getVehicleById(Long id);

    VehicleResponse updateVehicle(
            Long id,
            CreateVehicleRequest request
    );

    void deleteVehicle(Long id);
}