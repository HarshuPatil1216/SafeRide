package com.saferide.service;

import com.saferide.dto.CreateRouteRequest;
import com.saferide.dto.RouteResponse;
import org.springframework.data.domain.Page;

public interface RouteService {

    RouteResponse createRoute(
            CreateRouteRequest request
    );

    Page<RouteResponse> getAllRoutes(
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    Page<RouteResponse> searchRoutes(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    RouteResponse getRouteById(Long id);

    RouteResponse updateRoute(
            Long id,
            CreateRouteRequest request
    );

    void deleteRoute(Long id);
}