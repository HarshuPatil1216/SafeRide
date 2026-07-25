package com.saferide.serviceimpl;

import com.saferide.dto.CreateRouteRequest;
import com.saferide.dto.RouteResponse;
import com.saferide.entity.Route;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.RouteRepository;
import com.saferide.service.RouteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;

    public RouteServiceImpl(
            RouteRepository routeRepository
    ) {
        this.routeRepository = routeRepository;
    }

    @Override
    public RouteResponse createRoute(
            CreateRouteRequest request
    ) {

        if (routeRepository.existsByRouteName(
                request.getRouteName()
        )) {
            throw new DuplicateResourceException(
                    "Route name already exists"
            );
        }

        Route route = new Route();

        route.setRouteName(request.getRouteName());
        route.setSource(request.getSource());
        route.setDestination(request.getDestination());
        route.setDistanceInKm(request.getDistanceInKm());
        route.setEstimatedDurationInMinutes(
                request.getEstimatedDurationInMinutes()
        );
        route.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );

        Route savedRoute = routeRepository.save(route);

        return mapToResponse(savedRoute);
    }

    @Override
    public Page<RouteResponse> getAllRoutes(
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                createSort(sortBy, sortDir)
        );

        return routeRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<RouteResponse> searchRoutes(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                createSort(sortBy, sortDir)
        );

        return routeRepository
                .findByRouteNameContainingIgnoreCaseOrSourceContainingIgnoreCaseOrDestinationContainingIgnoreCase(
                        query,
                        query,
                        query,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    public RouteResponse getRouteById(Long id) {

        Route route = findRouteById(id);

        return mapToResponse(route);
    }

    @Override
    public RouteResponse updateRoute(
            Long id,
            CreateRouteRequest request
    ) {

        Route route = findRouteById(id);

        if (!route.getRouteName()
                .equalsIgnoreCase(request.getRouteName())
                && routeRepository.existsByRouteName(
                request.getRouteName()
        )) {
            throw new DuplicateResourceException(
                    "Route name already exists"
            );
        }

        route.setRouteName(request.getRouteName());
        route.setSource(request.getSource());
        route.setDestination(request.getDestination());
        route.setDistanceInKm(request.getDistanceInKm());
        route.setEstimatedDurationInMinutes(
                request.getEstimatedDurationInMinutes()
        );

        if (request.getActive() != null) {
            route.setActive(request.getActive());
        }

        Route updatedRoute = routeRepository.save(route);

        return mapToResponse(updatedRoute);
    }

    @Override
    public void deleteRoute(Long id) {

        Route route = findRouteById(id);

        routeRepository.delete(route);
    }

    private Route findRouteById(Long id) {

        return routeRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Route not found"
                        )
                );
    }

    private Sort createSort(
            String sortBy,
            String sortDir
    ) {

        if ("desc".equalsIgnoreCase(sortDir)) {
            return Sort.by(sortBy).descending();
        }

        return Sort.by(sortBy).ascending();
    }

    private RouteResponse mapToResponse(
            Route route
    ) {

        return new RouteResponse(
                route.getId(),
                route.getRouteName(),
                route.getSource(),
                route.getDestination(),
                route.getDistanceInKm(),
                route.getEstimatedDurationInMinutes(),
                route.getActive(),
                route.getCreatedAt()
        );
    }
}