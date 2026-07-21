package com.saferide.controller;

import com.saferide.dto.CreateRideRequest;
import com.saferide.dto.RideResponse;
import com.saferide.service.RideService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping
    public ResponseEntity<RideResponse> createRide(
            @Valid @RequestBody CreateRideRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(rideService.createRide(request));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<RideResponse>> getAllRides() {
        return ResponseEntity.ok(
                rideService.getAllRides()
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<RideResponse> getRideById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                rideService.getRideById(id)
        );
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<RideResponse> startRide(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                rideService.startRide(id)
        );
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<RideResponse> endRide(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                rideService.endRide(id)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRide(
            @PathVariable Long id
    ) {
        rideService.deleteRide(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}