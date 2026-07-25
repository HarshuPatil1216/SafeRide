package com.saferide.serviceimpl;

import com.saferide.dto.CreateStopRequest;
import com.saferide.dto.StopResponse;
import com.saferide.entity.Route;
import com.saferide.entity.Stop;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import com.saferide.service.StopService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StopServiceImpl implements StopService {

    private final StopRepository stopRepository;
    private final RouteRepository routeRepository;

    public StopServiceImpl(
            StopRepository stopRepository,
            RouteRepository routeRepository
    ) {
        this.stopRepository = stopRepository;
        this.routeRepository = routeRepository;
    }

    @Override
    @Transactional
    public StopResponse createStop(
            CreateStopRequest request
    ) {
        Route route = findRouteById(request.getRouteId());

        validateUniqueStop(
                route.getId(),
                request.getStopName(),
                request.getStopOrder(),
                null
        );

        Stop stop = new Stop();

        stop.setStopName(request.getStopName());
        stop.setAddress(request.getAddress());
        stop.setLatitude(request.getLatitude());
        stop.setLongitude(request.getLongitude());
        stop.setStopOrder(request.getStopOrder());
        stop.setEstimatedArrivalMinutes(
                request.getEstimatedArrivalMinutes()
        );
        stop.setRoute(route);
        stop.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );

        try {
            Stop savedStop = stopRepository.save(stop);
            return mapToResponse(savedStop);
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException(
                    "Stop name or stop order already exists for this route"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StopResponse> getAllStops(
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

        return stopRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StopResponse> searchStops(
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

        return stopRepository
                .findByStopNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
                        query,
                        query,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StopResponse> getStopsByRouteId(
            Long routeId
    ) {
        findRouteById(routeId);

        return stopRepository
                .findByRouteIdOrderByStopOrderAsc(routeId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StopResponse getStopById(Long id) {
        return mapToResponse(findStopById(id));
    }

    @Override
    @Transactional
    public StopResponse updateStop(
            Long id,
            CreateStopRequest request
    ) {
        Stop stop = findStopById(id);
        Route route = findRouteById(request.getRouteId());

        validateUniqueStop(
                route.getId(),
                request.getStopName(),
                request.getStopOrder(),
                stop
        );

        stop.setStopName(request.getStopName());
        stop.setAddress(request.getAddress());
        stop.setLatitude(request.getLatitude());
        stop.setLongitude(request.getLongitude());
        stop.setStopOrder(request.getStopOrder());
        stop.setEstimatedArrivalMinutes(
                request.getEstimatedArrivalMinutes()
        );
        stop.setRoute(route);

        if (request.getActive() != null) {
            stop.setActive(request.getActive());
        }

        try {
            Stop updatedStop = stopRepository.save(stop);
            return mapToResponse(updatedStop);
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException(
                    "Stop name or stop order already exists for this route"
            );
        }
    }

    @Override
    @Transactional
    public void deleteStop(Long id) {
        Stop stop = findStopById(id);
        stopRepository.delete(stop);
    }

    private void validateUniqueStop(
            Long routeId,
            String stopName,
            Integer stopOrder,
            Stop existingStop
    ) {
        boolean nameChanged = existingStop == null
                || !existingStop.getRoute().getId().equals(routeId)
                || !existingStop.getStopName()
                .equalsIgnoreCase(stopName);

        boolean orderChanged = existingStop == null
                || !existingStop.getRoute().getId().equals(routeId)
                || !existingStop.getStopOrder().equals(stopOrder);

        if (nameChanged
                && stopRepository.existsByRouteIdAndStopNameIgnoreCase(
                routeId,
                stopName
        )) {
            throw new DuplicateResourceException(
                    "Stop name already exists for this route"
            );
        }

        if (orderChanged
                && stopRepository.existsByRouteIdAndStopOrder(
                routeId,
                stopOrder
        )) {
            throw new DuplicateResourceException(
                    "Stop order already exists for this route"
            );
        }
    }

    private Stop findStopById(Long id) {
        return stopRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Stop not found"
                        )
                );
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

    private StopResponse mapToResponse(
            Stop stop
    ) {
        return new StopResponse(
                stop.getId(),
                stop.getStopName(),
                stop.getAddress(),
                stop.getLatitude(),
                stop.getLongitude(),
                stop.getStopOrder(),
                stop.getEstimatedArrivalMinutes(),
                stop.getActive(),
                stop.getRoute().getId(),
                stop.getRoute().getRouteName(),
                stop.getCreatedAt()
        );
    }
}