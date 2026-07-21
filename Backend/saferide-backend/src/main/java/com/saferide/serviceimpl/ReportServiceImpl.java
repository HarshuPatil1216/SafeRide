package com.saferide.serviceimpl;

import com.saferide.dto.RideResponse;
import com.saferide.entity.Ride;
import com.saferide.enums.RideStatus;
import com.saferide.repository.RideRepository;
import com.saferide.service.ReportService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final RideRepository rideRepository;

    public ReportServiceImpl(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    @Override
    public List<RideResponse> getCompletedRides() {

        return rideRepository.findByStatus(RideStatus.COMPLETED)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<RideResponse> getRunningRides() {

        return rideRepository.findByStatus(RideStatus.IN_PROGRESS)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<RideResponse> getScheduledRides() {

        return rideRepository.findByStatus(RideStatus.SCHEDULED)
                .stream()
                .map(this::mapToResponse)
                .toList();
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