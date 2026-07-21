package com.saferide.service;

import com.saferide.dto.CreateRideRequest;
import com.saferide.dto.RideResponse;

import java.util.List;

public interface RideService {

    RideResponse createRide(CreateRideRequest request);

    List<RideResponse> getAllRides();

    RideResponse getRideById(Long id);

    RideResponse startRide(Long id);

    RideResponse endRide(Long id);

    void deleteRide(Long id);
}