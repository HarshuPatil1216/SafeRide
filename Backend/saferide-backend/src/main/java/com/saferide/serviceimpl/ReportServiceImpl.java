package com.saferide.serviceimpl;

import com.saferide.dto.RideResponse;
import com.saferide.dto.StudentAttendanceReportResponse;
import com.saferide.entity.Ride;
import com.saferide.entity.Stop;
import com.saferide.entity.StudentRideEvent;
import com.saferide.enums.RideStatus;
import com.saferide.enums.StudentRideEventType;
import com.saferide.repository.RideRepository;
import com.saferide.repository.StudentRideEventRepository;
import com.saferide.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final RideRepository rideRepository;
    private final StudentRideEventRepository studentRideEventRepository;

    public ReportServiceImpl(
            RideRepository rideRepository,
            StudentRideEventRepository studentRideEventRepository
    ) {
        this.rideRepository = rideRepository;
        this.studentRideEventRepository = studentRideEventRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RideResponse> getAllRides() {

        return rideRepository.findAll()
                .stream()
                .map(this::mapRideToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RideResponse> getCompletedRides() {

        return rideRepository.findByStatus(
                        RideStatus.COMPLETED
                )
                .stream()
                .map(this::mapRideToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RideResponse> getRunningRides() {

        return rideRepository.findByStatus(
                        RideStatus.IN_PROGRESS
                )
                .stream()
                .map(this::mapRideToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RideResponse> getScheduledRides() {

        return rideRepository.findByStatus(
                        RideStatus.SCHEDULED
                )
                .stream()
                .map(this::mapRideToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAttendanceReportResponse>
    getAllAttendanceEvents() {

        return studentRideEventRepository.findAll()
                .stream()
                .map(this::mapAttendanceToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAttendanceReportResponse>
    getAttendanceEventsByType(
            StudentRideEventType eventType
    ) {

        return studentRideEventRepository
                .findByEventTypeOrderByEventTimeDesc(
                        eventType
                )
                .stream()
                .map(this::mapAttendanceToResponse)
                .toList();
    }

    private RideResponse mapRideToResponse(
            Ride ride
    ) {

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

    private StudentAttendanceReportResponse
    mapAttendanceToResponse(
            StudentRideEvent event
    ) {

        Stop stop = event.getStop();

        return new StudentAttendanceReportResponse(
                event.getId(),
                event.getStudent().getId(),
                event.getStudent().getFullName(),
                event.getRide().getId(),
                event.getEventType(),

                stop != null
                        ? stop.getId()
                        : null,

                stop != null
                        ? stop.getStopName()
                        : null,

                event.getEventTime(),
                event.getRemarks()
        );
    }
}