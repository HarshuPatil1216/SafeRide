package com.saferide.controller;

import com.saferide.dto.RideResponse;
import com.saferide.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports/rides")
@Tag(
        name = "Ride Reports",
        description = "APIs for viewing ride reports by status"
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
    @GetMapping
    public ResponseEntity<List<RideResponse>> getAllRides() {

        return ResponseEntity.ok(
                reportService.getAllRides()
        );
    }

    @Operation(
            summary = "Get completed ride reports",
            description = "Returns all completed rides"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Completed rides returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/completed")
    public ResponseEntity<List<RideResponse>> getCompletedRides() {

        return ResponseEntity.ok(
                reportService.getCompletedRides()
        );
    }

    @Operation(
            summary = "Get running ride reports",
            description = "Returns all rides currently in progress"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Running rides returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/running")
    public ResponseEntity<List<RideResponse>> getRunningRides() {

        return ResponseEntity.ok(
                reportService.getRunningRides()
        );
    }

    @Operation(
            summary = "Get scheduled ride reports",
            description = "Returns all scheduled rides"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Scheduled rides returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/scheduled")
    public ResponseEntity<List<RideResponse>> getScheduledRides() {

        return ResponseEntity.ok(
                reportService.getScheduledRides()
        );
    }
}