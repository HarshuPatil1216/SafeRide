package com.saferide.controller;

import com.saferide.dto.CreateStopRequest;
import com.saferide.dto.StopResponse;
import com.saferide.service.StopService;
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

import java.util.List;

@RestController
@RequestMapping("/api/stops")
@Validated
@Tag(
        name = "Stop Management",
        description = "APIs for creating, viewing, searching, updating and deleting route stops"
)
public class StopController {

    private final StopService stopService;

    public StopController(
            StopService stopService
    ) {
        this.stopService = stopService;
    }

    @Operation(
            summary = "Create a stop",
            description = "Creates a stop under an existing route"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Stop created successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Route not found"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Stop name or stop order already exists for this route"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<StopResponse> createStop(
            @Valid @RequestBody CreateStopRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(stopService.createStop(request));
    }

    @Operation(
            summary = "Get all stops",
            description = "Returns stops with pagination and sorting"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Stops returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<StopResponse>> getAllStops(
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
                stopService.getAllStops(
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Search stops",
            description = "Searches stops by stop name or address"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Matching stops returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<StopResponse>> searchStops(
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
                stopService.searchStops(
                        query,
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Get stops by route",
            description = "Returns all stops of a route ordered by stop order"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Route stops returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Route not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/route/{routeId}")
    public ResponseEntity<List<StopResponse>> getStopsByRouteId(
            @PathVariable Long routeId
    ) {
        return ResponseEntity.ok(
                stopService.getStopsByRouteId(routeId)
        );
    }

    @Operation(
            summary = "Get stop by ID",
            description = "Returns the stop matching the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Stop found successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Stop not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StopResponse> getStopById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                stopService.getStopById(id)
        );
    }

    @Operation(
            summary = "Update a stop",
            description = "Updates stop details using the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Stop updated successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Stop or route not found"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Stop name or stop order already exists for this route"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<StopResponse> updateStop(
            @PathVariable Long id,
            @Valid @RequestBody CreateStopRequest request
    ) {
        return ResponseEntity.ok(
                stopService.updateStop(id, request)
        );
    }

    @Operation(
            summary = "Delete a stop",
            description = "Deletes the stop matching the provided ID"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Stop deleted successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Stop not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStop(
            @PathVariable Long id
    ) {
        stopService.deleteStop(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}