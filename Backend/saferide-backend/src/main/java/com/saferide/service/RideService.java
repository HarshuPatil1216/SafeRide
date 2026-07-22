package com.saferide.service;

import com.saferide.dto.CreateRideRequest;
import com.saferide.dto.RideResponse;
import org.springframework.data.domain.Page;

public interface RideService {

    RideResponse createRide(CreateRideRequest request);

    Page<RideResponse> getAllRides(
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    RideResponse getRideById(Long id);

    RideResponse startRide(Long id);

    RideResponse endRide(Long id);

    void deleteRide(Long id);
}