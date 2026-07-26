package com.saferide.controller;

import com.saferide.dto.SearchResultResponse;
import com.saferide.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@Tag(
        name = "Global Search",
        description = "Searches students, parents, drivers, vehicles, routes and stops"
)
public class SearchController {

    private final SearchService searchService;

    public SearchController(
            SearchService searchService
    ) {
        this.searchService = searchService;
    }

    @Operation(
            summary = "Global search",
            description = "Returns matching records across multiple SafeRide modules"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Search results returned successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Search query cannot be empty"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<SearchResultResponse>> search(
            @RequestParam String query
    ) {
        return ResponseEntity.ok(
                searchService.search(query)
        );
    }
}