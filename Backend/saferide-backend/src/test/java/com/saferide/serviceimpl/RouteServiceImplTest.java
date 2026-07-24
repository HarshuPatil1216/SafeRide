package com.saferide.serviceimpl;

import com.saferide.dto.CreateRouteRequest;
import com.saferide.dto.RouteResponse;
import com.saferide.entity.Route;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.RouteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RouteServiceImplTest {

    @Mock
    private RouteRepository routeRepository;

    @InjectMocks
    private RouteServiceImpl routeService;

    private CreateRouteRequest request;
    private Route route;

    @BeforeEach
    void setUp() {

        request = new CreateRouteRequest();
        request.setRouteName("Pune Route");
        request.setSource("Pune");
        request.setDestination("Mumbai");
        request.setDistanceInKm(150.0);
        request.setEstimatedDurationInMinutes(180);
        request.setActive(true);

        route = new Route();
        route.setId(1L);
        route.setRouteName(request.getRouteName());
        route.setSource(request.getSource());
        route.setDestination(request.getDestination());
        route.setDistanceInKm(request.getDistanceInKm());
        route.setEstimatedDurationInMinutes(
                request.getEstimatedDurationInMinutes()
        );
        route.setActive(request.getActive());
    }

    @Test
    void createRoute_shouldReturnRouteResponse() {

        when(routeRepository.existsByRouteName(
                request.getRouteName()
        )).thenReturn(false);

        when(routeRepository.save(any(Route.class)))
                .thenReturn(route);

        RouteResponse response =
                routeService.createRoute(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Pune Route", response.getRouteName());

        verify(routeRepository)
                .save(any(Route.class));
    }

    @Test
    void createRoute_shouldThrowWhenRouteAlreadyExists() {

        when(routeRepository.existsByRouteName(
                request.getRouteName()
        )).thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> routeService.createRoute(request)
                );

        assertEquals(
                "Route name already exists",
                exception.getMessage()
        );

        verify(routeRepository, never())
                .save(any(Route.class));
    }    @Test
    void getRouteById_shouldReturnRouteResponse() {

        when(routeRepository.findById(1L))
                .thenReturn(Optional.of(route));

        RouteResponse response =
                routeService.getRouteById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Pune Route", response.getRouteName());
        assertEquals("Pune", response.getSource());
        assertEquals("Mumbai", response.getDestination());
    }

    @Test
    void getRouteById_shouldThrowWhenRouteNotFound() {

        when(routeRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> routeService.getRouteById(999L)
                );

        assertEquals(
                "Route not found",
                exception.getMessage()
        );
    }

    @Test
    void updateRoute_shouldReturnUpdatedRouteResponse() {

        when(routeRepository.findById(1L))
                .thenReturn(Optional.of(route));

        when(routeRepository.save(any(Route.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        request.setRouteName("Updated Pune Route");
        request.setSource("Pune Station");
        request.setDestination("Mumbai Airport");
        request.setDistanceInKm(155.0);
        request.setEstimatedDurationInMinutes(210);

        RouteResponse response =
                routeService.updateRoute(1L, request);

        assertNotNull(response);
        assertEquals(
                "Updated Pune Route",
                response.getRouteName()
        );
        assertEquals(
                "Pune Station",
                response.getSource()
        );
        assertEquals(
                "Mumbai Airport",
                response.getDestination()
        );

        verify(routeRepository)
                .save(route);
    }

    @Test
    void deleteRoute_shouldDeleteExistingRoute() {

        when(routeRepository.findById(1L))
                .thenReturn(Optional.of(route));

        routeService.deleteRoute(1L);

        verify(routeRepository)
                .delete(route);
    }
}