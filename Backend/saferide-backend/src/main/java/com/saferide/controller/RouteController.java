package com.saferide.controller;

import com.saferide.dto.CreateRouteRequest;
import com.saferide.dto.RouteResponse;
import com.saferide.service.RouteService;
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
@RequestMapping("/api/routes")
@Validated
@Tag(
        name = "Route Management",
        description = "APIs for creating, viewing, searching, updating and deleting routes"
)
public class RouteController {

    private final RouteService routeService;

    public RouteController(
            RouteService routeService
    ) {
        this.routeService = routeService;
    }

    @Operation(
            summary = "Create a route",
            description = "Creates a new route with a unique route name"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Route created successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Route name already exists"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<RouteResponse> createRoute(
            @Valid @RequestBody CreateRouteRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(routeService.createRoute(request));
    }

    @Operation(
            summary = "Get all routes",
            description = "Returns routes with pagination and sorting"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Routes returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<RouteResponse>> getAllRoutes(
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
                routeService.getAllRoutes(
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Search routes",
            description = "Searches routes by route name, source or destination"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Matching routes returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<RouteResponse>> searchRoutes(
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
                routeService.searchRoutes(
                        query,
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Get route by ID",
            description = "Returns the route matching the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Route found successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Route not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<RouteResponse> getRouteById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                routeService.getRouteById(id)
        );
    }

    @Operation(
            summary = "Update a route",
            description = "Updates route details using the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Route updated successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Route not found"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Route name already exists"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RouteResponse> updateRoute(
            @PathVariable Long id,
            @Valid @RequestBody CreateRouteRequest request
    ) {
        return ResponseEntity.ok(
                routeService.updateRoute(id, request)
        );
    }

    @Operation(
            summary = "Delete a route",
            description = "Deletes the route matching the provided ID"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Route deleted successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Route not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(
            @PathVariable Long id
    ) {
        routeService.deleteRoute(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}