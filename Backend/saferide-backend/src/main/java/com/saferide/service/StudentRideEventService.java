package com.saferide.service;

import com.saferide.dto.CreateStudentRideEventRequest;
import com.saferide.dto.StudentRideEventResponse;
import org.springframework.data.domain.Page;

public interface StudentRideEventService {

    StudentRideEventResponse createEvent(
            CreateStudentRideEventRequest request
    );

    StudentRideEventResponse getEventById(
            Long id
    );

    Page<StudentRideEventResponse> getEventsByStudent(
            Long studentId,
            int page,
            int size
    );

    Page<StudentRideEventResponse> getEventsByRide(
            Long rideId,
            int page,
            int size
    );
}