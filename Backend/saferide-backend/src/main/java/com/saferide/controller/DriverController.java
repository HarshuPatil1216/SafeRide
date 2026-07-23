package com.saferide.controller;

import com.saferide.dto.CreateDriverRequest;
import com.saferide.dto.DriverResponse;
import com.saferide.service.DriverService;
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
@RequestMapping("/api/drivers")
@Validated
@Tag(
        name = "Driver Management",
        description = "APIs for creating, viewing, searching, updating and deleting drivers"
)
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @Operation(
            summary = "Create a new driver",
            description = "Creates a new driver with unique email, phone and license number"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Driver created successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Email, phone or license number already exists"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<DriverResponse> createDriver(
            @Valid @RequestBody CreateDriverRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(driverService.createDriver(request));
    }

    @Operation(
            summary = "Get all drivers with pagination and sorting",
            description = "Returns drivers page-wise with configurable page size and sorting"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Paged drivers returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<DriverResponse>> getAllDrivers(
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
                driverService.getAllDrivers(
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Search drivers",
            description = "Searches drivers by full name or email with pagination and sorting"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Matching drivers returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<DriverResponse>> searchDrivers(
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
                driverService.searchDrivers(
                        query,
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Get driver by ID",
            description = "Returns the driver matching the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Driver found successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Driver not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<DriverResponse> getDriverById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                driverService.getDriverById(id)
        );
    }

    @Operation(
            summary = "Update a driver",
            description = "Updates driver details using the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Driver updated successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Driver not found"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Email, phone or license number already exists"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<DriverResponse> updateDriver(
            @PathVariable Long id,
            @Valid @RequestBody CreateDriverRequest request
    ) {
        return ResponseEntity.ok(
                driverService.updateDriver(id, request)
        );
    }

    @Operation(
            summary = "Delete a driver",
            description = "Deletes the driver matching the provided ID"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Driver deleted successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Driver not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(
            @PathVariable Long id
    ) {
        driverService.deleteDriver(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}