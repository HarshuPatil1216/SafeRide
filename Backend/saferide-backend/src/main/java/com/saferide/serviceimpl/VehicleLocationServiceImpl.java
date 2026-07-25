package com.saferide.serviceimpl;

import com.saferide.dto.UpdateVehicleLocationRequest;
import com.saferide.dto.VehicleLocationResponse;
import com.saferide.entity.Vehicle;
import com.saferide.entity.VehicleLocation;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.VehicleLocationRepository;
import com.saferide.repository.VehicleRepository;
import com.saferide.service.VehicleLocationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VehicleLocationServiceImpl
        implements VehicleLocationService {

    private final VehicleLocationRepository vehicleLocationRepository;
    private final VehicleRepository vehicleRepository;

    public VehicleLocationServiceImpl(
            VehicleLocationRepository vehicleLocationRepository,
            VehicleRepository vehicleRepository
    ) {
        this.vehicleLocationRepository = vehicleLocationRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    @Transactional
    public VehicleLocationResponse updateLocation(
            UpdateVehicleLocationRequest request
    ) {

        Vehicle vehicle = vehicleRepository
                .findById(request.getVehicleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found"
                        )
                );

        VehicleLocation location = new VehicleLocation();

        location.setVehicle(vehicle);
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setSpeed(request.getSpeed());
        location.setHeading(request.getHeading());
        location.setActive(true);

        VehicleLocation saved =
                vehicleLocationRepository.save(location);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleLocationResponse getLatestLocation(
            Long vehicleId
    ) {

        VehicleLocation location =
                vehicleLocationRepository
                        .findTopByVehicleIdOrderByRecordedAtDesc(vehicleId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Vehicle location not found"
                                )
                        );

        return mapToResponse(location);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleLocationResponse> getLocationHistory(
            Long vehicleId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        return vehicleLocationRepository
                .findByVehicleIdOrderByRecordedAtDesc(
                        vehicleId,
                        pageable
                )
                .map(this::mapToResponse);
    }

    private VehicleLocationResponse mapToResponse(
            VehicleLocation location
    ) {

        return new VehicleLocationResponse(
                location.getId(),
                location.getVehicle().getId(),
                location.getVehicle().getVehicleNumber(),
                location.getLatitude(),
                location.getLongitude(),
                location.getSpeed(),
                location.getHeading(),
                location.getActive(),
                location.getRecordedAt()
        );
    }
}