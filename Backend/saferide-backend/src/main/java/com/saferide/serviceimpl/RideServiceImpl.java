package com.saferide.serviceimpl;

import com.saferide.dto.CreateRideRequest;
import com.saferide.dto.RideResponse;
import com.saferide.entity.Driver;
import com.saferide.entity.Ride;
import com.saferide.entity.Vehicle;
import com.saferide.enums.RideStatus;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.VehicleRepository;
import com.saferide.service.RideService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() ->
                        new RuntimeException("Driver not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found"));

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
    public List<RideResponse> getAllRides() {

        return rideRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }    @Override
    public RideResponse getRideById(Long id) {

        Ride ride = rideRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found")
                );

        return mapToResponse(ride);
    }

    @Override
    public RideResponse startRide(Long id) {

        Ride ride = rideRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found")
                );

        if (ride.getStatus() != RideStatus.SCHEDULED) {
            throw new RuntimeException(
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

        Ride ride = rideRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found")
                );

        if (ride.getStatus() != RideStatus.IN_PROGRESS) {
            throw new RuntimeException(
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

        Ride ride = rideRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found")
                );

        rideRepository.delete(ride);
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