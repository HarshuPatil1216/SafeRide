package com.saferide.controller;

import com.saferide.dto.CreateStudentRideEventRequest;
import com.saferide.dto.StudentRideEventResponse;
import com.saferide.service.StudentRideEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student-ride-events")
@Validated
@Tag(
        name = "Student Ride Events",
        description = "APIs for recording and viewing student pickup and drop-off events"
)
public class StudentRideEventController {

    private final StudentRideEventService studentRideEventService;

    public StudentRideEventController(
            StudentRideEventService studentRideEventService
    ) {
        this.studentRideEventService = studentRideEventService;
    }

    @Operation(
            summary = "Record student ride event",
            description = "Records a student pickup or drop-off event for an in-progress ride"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Student ride event recorded successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid event sequence, ride status, route or stop"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Student, ride or stop not found"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Pickup or drop-off event already recorded"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_DRIVER')"
    )
    @PostMapping
    public ResponseEntity<StudentRideEventResponse> createEvent(
            @Valid @RequestBody CreateStudentRideEventRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        studentRideEventService.createEvent(request)
                );
    }

    @Operation(
            summary = "Get event by ID",
            description = "Returns the student ride event matching the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Student ride event returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Student ride event not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_DRIVER', 'ROLE_PARENT')"
    )
    @GetMapping("/{id}")
    public ResponseEntity<StudentRideEventResponse> getEventById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                studentRideEventService.getEventById(id)
        );
    }

    @Operation(
            summary = "Get events by student",
            description = "Returns paginated pickup and drop-off events for a student"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Student ride events returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Student not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_DRIVER', 'ROLE_PARENT')"
    )
    @GetMapping("/student/{studentId}")
    public ResponseEntity<Page<StudentRideEventResponse>>
    getEventsByStudent(
            @PathVariable Long studentId,

            @RequestParam(defaultValue = "0")
            @Min(
                    value = 0,
                    message = "Page number cannot be negative"
            )
            int page,

            @RequestParam(defaultValue = "20")
            @Min(
                    value = 1,
                    message = "Page size must be at least 1"
            )
            @Max(
                    value = 100,
                    message = "Page size cannot exceed 100"
            )
            int size
    ) {
        return ResponseEntity.ok(
                studentRideEventService.getEventsByStudent(
                        studentId,
                        page,
                        size
                )
        );
    }

    @Operation(
            summary = "Get events by ride",
            description = "Returns paginated pickup and drop-off events for a ride"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Ride events returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Ride not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_DRIVER')"
    )
    @GetMapping("/ride/{rideId}")
    public ResponseEntity<Page<StudentRideEventResponse>>
    getEventsByRide(
            @PathVariable Long rideId,

            @RequestParam(defaultValue = "0")
            @Min(
                    value = 0,
                    message = "Page number cannot be negative"
            )
            int page,

            @RequestParam(defaultValue = "20")
            @Min(
                    value = 1,
                    message = "Page size must be at least 1"
            )
            @Max(
                    value = 100,
                    message = "Page size cannot exceed 100"
            )
            int size
    ) {
        return ResponseEntity.ok(
                studentRideEventService.getEventsByRide(
                        rideId,
                        page,
                        size
                )
        );
    }
}