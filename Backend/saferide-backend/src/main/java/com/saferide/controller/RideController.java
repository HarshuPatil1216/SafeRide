package com.saferide.controller;

import com.saferide.dto.CreateRideRequest;
import com.saferide.dto.RideResponse;
import com.saferide.service.RideService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@Tag(
        name = "Ride Management",
        description = "APIs for creating, viewing, starting, ending and deleting rides"
)
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @Operation(
            summary = "Create a new ride",
            description = "Creates a scheduled ride using an existing driver and vehicle"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Ride created successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Driver or vehicle not found"
    )
    @PostMapping
    public ResponseEntity<RideResponse> createRide(
            @Valid @RequestBody CreateRideRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(rideService.createRide(request));
    }

    @Operation(
            summary = "Get all rides",
            description = "Returns all rides available in the system"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Rides returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<RideResponse>> getAllRides() {
        return ResponseEntity.ok(
                rideService.getAllRides()
        );
    }

    @Operation(
            summary = "Get ride by ID",
            description = "Returns the ride matching the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Ride found successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Ride not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<RideResponse> getRideById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                rideService.getRideById(id)
        );
    }

    @Operation(
            summary = "Start a ride",
            description = "Changes a scheduled ride to IN_PROGRESS and records its start time"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Ride started successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Only a scheduled ride can be started"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Ride not found"
    )
    @PutMapping("/{id}/start")
    public ResponseEntity<RideResponse> startRide(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                rideService.startRide(id)
        );
    }

    @Operation(
            summary = "End a ride",
            description = "Changes an in-progress ride to COMPLETED and records its end time"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Ride completed successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Only an in-progress ride can be completed"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Ride not found"
    )
    @PutMapping("/{id}/end")
    public ResponseEntity<RideResponse> endRide(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                rideService.endRide(id)
        );
    }

    @Operation(
            summary = "Delete a ride",
            description = "Deletes the ride matching the provided ID"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Ride deleted successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Ride not found"
    )
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