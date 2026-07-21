package com.saferide.controller;

import com.saferide.dto.RideResponse;
import com.saferide.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports/rides")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/completed")
    public ResponseEntity<List<RideResponse>> getCompletedRides() {
        return ResponseEntity.ok(
                reportService.getCompletedRides()
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/running")
    public ResponseEntity<List<RideResponse>> getRunningRides() {
        return ResponseEntity.ok(
                reportService.getRunningRides()
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/scheduled")
    public ResponseEntity<List<RideResponse>> getScheduledRides() {
        return ResponseEntity.ok(
                reportService.getScheduledRides()
        );
    }
}