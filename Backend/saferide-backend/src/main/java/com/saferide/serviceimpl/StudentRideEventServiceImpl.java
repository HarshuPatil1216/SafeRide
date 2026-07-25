package com.saferide.serviceimpl;

import com.saferide.dto.CreateStudentRideEventRequest;
import com.saferide.dto.StudentRideEventResponse;
import com.saferide.entity.Ride;
import com.saferide.entity.Stop;
import com.saferide.entity.Student;
import com.saferide.entity.StudentRideEvent;
import com.saferide.enums.RideStatus;
import com.saferide.enums.StudentRideEventType;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.RideRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.repository.StudentRideEventRepository;
import com.saferide.service.StudentRideEventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentRideEventServiceImpl
        implements StudentRideEventService {

    private final StudentRideEventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final RideRepository rideRepository;
    private final StopRepository stopRepository;

    public StudentRideEventServiceImpl(
            StudentRideEventRepository eventRepository,
            StudentRepository studentRepository,
            RideRepository rideRepository,
            StopRepository stopRepository
    ) {
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
        this.rideRepository = rideRepository;
        this.stopRepository = stopRepository;
    }

    @Override
    @Transactional
    public StudentRideEventResponse createEvent(
            CreateStudentRideEventRequest request
    ) {

        Student student = findStudentById(
                request.getStudentId()
        );

        Ride ride = findRideById(
                request.getRideId()
        );

        validateRideStatus(ride);

        Stop stop = findOptionalStopById(
                request.getStopId()
        );

        validateStudentRideEvent(
                student,
                ride,
                stop,
                request.getEventType()
        );

        StudentRideEvent event = new StudentRideEvent();

        event.setStudent(student);
        event.setRide(ride);
        event.setEventType(request.getEventType());
        event.setStop(stop);
        event.setLatitude(request.getLatitude());
        event.setLongitude(request.getLongitude());
        event.setRemarks(request.getRemarks());

        StudentRideEvent savedEvent =
                eventRepository.save(event);

        return mapToResponse(savedEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentRideEventResponse getEventById(
            Long id
    ) {

        StudentRideEvent event = eventRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student ride event not found"
                        )
                );

        return mapToResponse(event);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentRideEventResponse> getEventsByStudent(
            Long studentId,
            int page,
            int size
    ) {

        findStudentById(studentId);

        Pageable pageable = PageRequest.of(
                page,
                size
        );

        return eventRepository
                .findByStudentIdOrderByEventTimeDesc(
                        studentId,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentRideEventResponse> getEventsByRide(
            Long rideId,
            int page,
            int size
    ) {

        findRideById(rideId);

        Pageable pageable = PageRequest.of(
                page,
                size
        );

        return eventRepository
                .findByRideIdOrderByEventTimeDesc(
                        rideId,
                        pageable
                )
                .map(this::mapToResponse);
    }

    private void validateRideStatus(Ride ride) {

        if (ride.getStatus() != RideStatus.IN_PROGRESS) {
            throw new IllegalArgumentException(
                    "Student pickup or drop can only be recorded for an in-progress ride"
            );
        }
    }

    private void validateStudentRideEvent(
            Student student,
            Ride ride,
            Stop stop,
            StudentRideEventType eventType
    ) {

        validateStudentRoute(student, ride);

        validateStudentStop(student, stop);

        if (eventType == StudentRideEventType.PICKED_UP) {
            validatePickup(student.getId(), ride.getId());
        }

        if (eventType == StudentRideEventType.DROPPED_OFF) {
            validateDrop(student.getId(), ride.getId());
        }
    }

    private void validateStudentRoute(
            Student student,
            Ride ride
    ) {

        if (student.getRoute() == null) {
            throw new IllegalArgumentException(
                    "Student is not assigned to any route"
            );
        }

        /*
         * Ride entity सध्या Route शी जोडलेली नसेल,
         * तर ही validation वापरता येणार नाही.
         *
         * Ride मध्ये getRoute() असेल तर खालील block enable कर:
         *
         * if (ride.getRoute() == null
         *         || !student.getRoute().getId()
         *         .equals(ride.getRoute().getId())) {
         *     throw new IllegalArgumentException(
         *             "Student is not assigned to this ride route"
         *     );
         * }
         */
    }

    private void validateStudentStop(
            Student student,
            Stop stop
    ) {

        if (stop == null) {
            return;
        }

        if (student.getRoute() == null) {
            throw new IllegalArgumentException(
                    "Student route must be assigned before recording a stop"
            );
        }

        if (!stop.getRoute().getId()
                .equals(student.getRoute().getId())) {
            throw new IllegalArgumentException(
                    "Selected stop does not belong to student's route"
            );
        }

        if (student.getStop() != null
                && !student.getStop().getId()
                .equals(stop.getId())) {
            throw new IllegalArgumentException(
                    "Selected stop is not assigned to this student"
            );
        }
    }

    private void validatePickup(
            Long studentId,
            Long rideId
    ) {

        boolean pickupAlreadyRecorded =
                eventRepository
                        .existsByStudentIdAndRideIdAndEventType(
                                studentId,
                                rideId,
                                StudentRideEventType.PICKED_UP
                        );

        if (pickupAlreadyRecorded) {
            throw new DuplicateResourceException(
                    "Student pickup already recorded for this ride"
            );
        }

        boolean dropAlreadyRecorded =
                eventRepository
                        .existsByStudentIdAndRideIdAndEventType(
                                studentId,
                                rideId,
                                StudentRideEventType.DROPPED_OFF
                        );

        if (dropAlreadyRecorded) {
            throw new IllegalArgumentException(
                    "Pickup cannot be recorded after drop-off"
            );
        }
    }

    private void validateDrop(
            Long studentId,
            Long rideId
    ) {

        boolean pickupRecorded =
                eventRepository
                        .existsByStudentIdAndRideIdAndEventType(
                                studentId,
                                rideId,
                                StudentRideEventType.PICKED_UP
                        );

        if (!pickupRecorded) {
            throw new IllegalArgumentException(
                    "Student must be picked up before drop-off"
            );
        }

        boolean dropAlreadyRecorded =
                eventRepository
                        .existsByStudentIdAndRideIdAndEventType(
                                studentId,
                                rideId,
                                StudentRideEventType.DROPPED_OFF
                        );

        if (dropAlreadyRecorded) {
            throw new DuplicateResourceException(
                    "Student drop-off already recorded for this ride"
            );
        }
    }

    private Student findStudentById(Long id) {

        return studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found"
                        )
                );
    }

    private Ride findRideById(Long id) {

        return rideRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ride not found"
                        )
                );
    }

    private Stop findOptionalStopById(Long id) {

        if (id == null) {
            return null;
        }

        return stopRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Stop not found"
                        )
                );
    }

    private StudentRideEventResponse mapToResponse(
            StudentRideEvent event
    ) {

        Stop stop = event.getStop();

        return new StudentRideEventResponse(
                event.getId(),
                event.getStudent().getId(),
                event.getStudent().getFullName(),
                event.getRide().getId(),
                event.getEventType(),
                stop != null ? stop.getId() : null,
                stop != null ? stop.getStopName() : null,
                event.getEventTime(),
                event.getLatitude(),
                event.getLongitude(),
                event.getRemarks()
        );
    }
}