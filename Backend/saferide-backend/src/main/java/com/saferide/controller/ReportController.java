package com.saferide.controller;

import com.saferide.dto.RideResponse;
import com.saferide.dto.StudentAttendanceReportResponse;
import com.saferide.dto.VehicleLocationReportResponse;
import com.saferide.enums.StudentRideEventType;
import com.saferide.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(
        name = "Reports",
        description = "APIs for ride, attendance and vehicle location reports"
)
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService
    ) {
        this.reportService = reportService;
    }

    @Operation(summary = "Get all ride reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/rides")
    public ResponseEntity<List<RideResponse>> getAllRides() {

        return ResponseEntity.ok(
                reportService.getAllRides()
        );
    }

    @Operation(summary = "Get completed ride reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/rides/completed")
    public ResponseEntity<List<RideResponse>> getCompletedRides() {

        return ResponseEntity.ok(
                reportService.getCompletedRides()
        );
    }

    @Operation(summary = "Get running ride reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/rides/running")
    public ResponseEntity<List<RideResponse>> getRunningRides() {

        return ResponseEntity.ok(
                reportService.getRunningRides()
        );
    }

    @Operation(summary = "Get scheduled ride reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/rides/scheduled")
    public ResponseEntity<List<RideResponse>> getScheduledRides() {

        return ResponseEntity.ok(
                reportService.getScheduledRides()
        );
    }

    @Operation(summary = "Get all attendance reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/attendance")
    public ResponseEntity<List<StudentAttendanceReportResponse>>
    getAllAttendanceEvents() {

        return ResponseEntity.ok(
                reportService.getAllAttendanceEvents()
        );
    }

    @Operation(summary = "Get attendance reports by event type")
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

    @Operation(summary = "Get all vehicle location reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/vehicle-locations")
    public ResponseEntity<List<VehicleLocationReportResponse>>
    getAllVehicleLocations() {

        return ResponseEntity.ok(
                reportService.getAllVehicleLocations()
        );
    }

    @Operation(summary = "Get vehicle location report by vehicle ID")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/vehicle-locations/{vehicleId}")
    public ResponseEntity<List<VehicleLocationReportResponse>>
    getVehicleLocationReport(
            @PathVariable Long vehicleId
    ) {

        return ResponseEntity.ok(
                reportService.getVehicleLocationReport(
                        vehicleId
                )
        );
    }
}