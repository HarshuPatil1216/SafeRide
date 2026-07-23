package com.saferide.controller;

import com.saferide.dto.CreateVehicleRequest;
import com.saferide.dto.VehicleResponse;
import com.saferide.service.VehicleService;
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
@RequestMapping("/api/vehicles")
@Validated
@Tag(
        name = "Vehicle Management",
        description = "APIs for creating, viewing, searching, updating and deleting vehicles"
)
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @Operation(
            summary = "Create a new vehicle",
            description = "Creates a vehicle with a unique vehicle number"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Vehicle created successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Vehicle number already exists"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(
            @Valid @RequestBody CreateVehicleRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(vehicleService.createVehicle(request));
    }

    @Operation(
            summary = "Get all vehicles with pagination and sorting",
            description = "Returns vehicles page-wise with configurable page size and sorting"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Paged vehicles returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<VehicleResponse>> getAllVehicles(
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page number cannot be negative")
            int page,

            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Page size must be at least 1")
            @Max(value = 100, message = "Page size cannot exceed 100")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String sortDir
    ) {
        return ResponseEntity.ok(
                vehicleService.getAllVehicles(
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Search vehicles",
            description = "Searches vehicles by vehicle number, model or manufacturer"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Matching vehicles returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<VehicleResponse>> searchVehicles(
            @RequestParam String query,

            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page number cannot be negative")
            int page,

            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Page size must be at least 1")
            @Max(value = 100, message = "Page size cannot exceed 100")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String sortDir
    ) {
        return ResponseEntity.ok(
                vehicleService.searchVehicles(
                        query,
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Get vehicle by ID",
            description = "Returns the vehicle matching the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Vehicle found successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Vehicle not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                vehicleService.getVehicleById(id)
        );
    }

    @Operation(
            summary = "Update a vehicle",
            description = "Updates vehicle details using the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Vehicle updated successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Vehicle not found"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Vehicle number already exists"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody CreateVehicleRequest request
    ) {
        return ResponseEntity.ok(
                vehicleService.updateVehicle(id, request)
        );
    }

    @Operation(
            summary = "Delete a vehicle",
            description = "Deletes the vehicle matching the provided ID"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Vehicle deleted successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Vehicle not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(
            @PathVariable Long id
    ) {
        vehicleService.deleteVehicle(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}