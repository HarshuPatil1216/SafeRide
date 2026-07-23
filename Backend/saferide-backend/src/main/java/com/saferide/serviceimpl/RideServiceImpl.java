package com.saferide.serviceimpl;

import com.saferide.dto.CreateRideRequest;
import com.saferide.dto.RideResponse;
import com.saferide.entity.Driver;
import com.saferide.entity.Ride;
import com.saferide.entity.Vehicle;
import com.saferide.enums.RideStatus;
import com.saferide.exception.InvalidRideStateException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.VehicleRepository;
import com.saferide.service.RideService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RideServiceImpl implements RideService {

    private final RideRepository rideRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    public RideServiceImpl(
            RideRepository rideRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository
    ) {
        this.rideRepository = rideRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public RideResponse createRide(CreateRideRequest request) {

        Driver driver = driverRepository
                .findById(request.getDriverId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Driver not found"
                        )
                );

        Vehicle vehicle = vehicleRepository
                .findById(request.getVehicleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found"
                        )
                );

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setVehicle(vehicle);
        ride.setSource(request.getSource());
        ride.setDestination(request.getDestination());
        ride.setStatus(RideStatus.SCHEDULED);

        Ride savedRide = rideRepository.save(ride);

        return mapToResponse(savedRide);
    }

    @Override
    public Page<RideResponse> getAllRides(
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

        return rideRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<RideResponse> searchRides(
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

        return rideRepository
                .findBySourceContainingIgnoreCaseOrDestinationContainingIgnoreCase(
                        query,
                        query,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    public RideResponse getRideById(Long id) {

        Ride ride = findRideById(id);

        return mapToResponse(ride);
    }

    @Override
    public RideResponse startRide(Long id) {

        Ride ride = findRideById(id);

        if (ride.getStatus() != RideStatus.SCHEDULED) {
            throw new InvalidRideStateException(
                    "Only scheduled ride can be started"
            );
        }

        ride.setStatus(RideStatus.IN_PROGRESS);
        ride.setStartTime(LocalDateTime.now());

        Ride updatedRide = rideRepository.save(ride);

        return mapToResponse(updatedRide);
    }

    @Override
    public RideResponse endRide(Long id) {

        Ride ride = findRideById(id);

        if (ride.getStatus() != RideStatus.IN_PROGRESS) {
            throw new InvalidRideStateException(
                    "Only in-progress ride can be completed"
            );
        }

        ride.setStatus(RideStatus.COMPLETED);
        ride.setEndTime(LocalDateTime.now());

        Ride updatedRide = rideRepository.save(ride);

        return mapToResponse(updatedRide);
    }

    @Override
    public void deleteRide(Long id) {

        Ride ride = findRideById(id);

        rideRepository.delete(ride);
    }

    private Ride findRideById(Long id) {

        return rideRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ride not found"
                        )
                );
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

    private RideResponse mapToResponse(Ride ride) {

        return new RideResponse(
                ride.getId(),

                ride.getDriver().getId(),
                ride.getDriver().getFullName(),

                ride.getVehicle().getId(),
                ride.getVehicle().getVehicleNumber(),

                ride.getSource(),
                ride.getDestination(),

                ride.getStatus(),

                ride.getStartTime(),
                ride.getEndTime(),
                ride.getCreatedAt()
        );
    }
}