package com.saferide.controller;

import com.saferide.dto.RideResponse;
import com.saferide.dto.StudentAttendanceReportResponse;
import com.saferide.enums.StudentRideEventType;
import com.saferide.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(
        name = "Reports",
        description = "APIs for ride and student attendance reports"
)
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService
    ) {
        this.reportService = reportService;
    }

    @Operation(
            summary = "Get all ride reports",
            description = "Returns all rides available in the system"
    )
    @ApiResponse(
            responseCode = "200",
            description = "All ride reports returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/rides")
    public ResponseEntity<List<RideResponse>> getAllRides() {

        return ResponseEntity.ok(
                reportService.getAllRides()
        );
    }

    @Operation(
            summary = "Get completed ride reports",
            description = "Returns all completed rides"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/rides/completed")
    public ResponseEntity<List<RideResponse>> getCompletedRides() {

        return ResponseEntity.ok(
                reportService.getCompletedRides()
        );
    }

    @Operation(
            summary = "Get running ride reports",
            description = "Returns all rides currently in progress"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/rides/running")
    public ResponseEntity<List<RideResponse>> getRunningRides() {

        return ResponseEntity.ok(
                reportService.getRunningRides()
        );
    }

    @Operation(
            summary = "Get scheduled ride reports",
            description = "Returns all scheduled rides"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/rides/scheduled")
    public ResponseEntity<List<RideResponse>> getScheduledRides() {

        return ResponseEntity.ok(
                reportService.getScheduledRides()
        );
    }

    @Operation(
            summary = "Get all student attendance events",
            description = "Returns all pickup and drop-off events"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/attendance")
    public ResponseEntity<List<StudentAttendanceReportResponse>>
    getAllAttendanceEvents() {

        return ResponseEntity.ok(
                reportService.getAllAttendanceEvents()
        );
    }

    @Operation(
            summary = "Get attendance events by type",
            description = "Returns pickup or drop-off events by event type"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/attendance/type")
    public ResponseEntity<List<StudentAttendanceReportResponse>>
    getAttendanceEventsByType(
            @RequestParam StudentRideEventType eventType
    ) {

        return ResponseEntity.ok(
                reportService.getAttendanceEventsByType(
                        eventType
                )
        );
    }
}