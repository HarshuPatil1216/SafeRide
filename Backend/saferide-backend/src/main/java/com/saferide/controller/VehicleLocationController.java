package com.saferide.controller;

import com.saferide.dto.UpdateVehicleLocationRequest;
import com.saferide.dto.VehicleLocationResponse;
import com.saferide.service.VehicleLocationService;
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
@RequestMapping("/api/vehicle-locations")
@Validated
@Tag(
        name = "Vehicle Location Tracking",
        description = "APIs for updating and viewing vehicle GPS locations"
)
public class VehicleLocationController {

    private final VehicleLocationService vehicleLocationService;

    public VehicleLocationController(
            VehicleLocationService vehicleLocationService
    ) {
        this.vehicleLocationService = vehicleLocationService;
    }

    @Operation(
            summary = "Update vehicle location",
            description = "Stores a new GPS location update for a vehicle"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Vehicle location stored successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid location data"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Vehicle not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_DRIVER')"
    )
    @PostMapping
    public ResponseEntity<VehicleLocationResponse> updateLocation(
            @Valid @RequestBody UpdateVehicleLocationRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        vehicleLocationService.updateLocation(request)
                );
    }

    @Operation(
            summary = "Get latest vehicle location",
            description = "Returns the most recent GPS location of a vehicle"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Latest location returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Vehicle location not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_DRIVER', 'ROLE_PARENT')"
    )
    @GetMapping("/{vehicleId}/latest")
    public ResponseEntity<VehicleLocationResponse> getLatestLocation(
            @PathVariable Long vehicleId
    ) {
        return ResponseEntity.ok(
                vehicleLocationService.getLatestLocation(vehicleId)
        );
    }

    @Operation(
            summary = "Get vehicle location history",
            description = "Returns paginated GPS location history of a vehicle"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Location history returned successfully"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_DRIVER')"
    )
    @GetMapping("/{vehicleId}/history")
    public ResponseEntity<Page<VehicleLocationResponse>>
    getLocationHistory(
            @PathVariable Long vehicleId,

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
                vehicleLocationService.getLocationHistory(
                        vehicleId,
                        page,
                        size
                )
        );
    }
}