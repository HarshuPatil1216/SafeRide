package com.saferide.serviceimpl;

import com.saferide.dto.SearchResultResponse;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.repository.VehicleRepository;
import com.saferide.service.SearchService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchServiceImpl implements SearchService {

    private static final int RESULTS_PER_TYPE = 5;

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;

    public SearchServiceImpl(
            StudentRepository studentRepository,
            ParentRepository parentRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository,
            RouteRepository routeRepository,
            StopRepository stopRepository
    ) {
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SearchResultResponse> search(
            String query
    ) {
        String normalizedQuery = normalizeQuery(query);

        Pageable pageable = PageRequest.of(
                0,
                RESULTS_PER_TYPE
        );

        List<SearchResultResponse> results =
                new ArrayList<>();

        studentRepository
                .findByFullNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(
                        normalizedQuery,
                        normalizedQuery,
                        pageable
                )
                .forEach(student ->
                        results.add(
                                new SearchResultResponse(
                                        "STUDENT",
                                        student.getId(),
                                        student.getFullName(),
                                        student.getRollNumber()
                                )
                        )
                );

        parentRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                        normalizedQuery,
                        normalizedQuery,
                        normalizedQuery,
                        pageable
                )
                .forEach(parent ->
                        results.add(
                                new SearchResultResponse(
                                        "PARENT",
                                        parent.getId(),
                                        parent.getFullName(),
                                        parent.getPhone()
                                )
                        )
                );

        driverRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        normalizedQuery,
                        normalizedQuery,
                        pageable
                )
                .forEach(driver ->
                        results.add(
                                new SearchResultResponse(
                                        "DRIVER",
                                        driver.getId(),
                                        driver.getFullName(),
                                        driver.getEmail()
                                )
                        )
                );

        vehicleRepository
                .findByVehicleNumberContainingIgnoreCaseOrModelContainingIgnoreCaseOrManufacturerContainingIgnoreCase(
                        normalizedQuery,
                        normalizedQuery,
                        normalizedQuery,
                        pageable
                )
                .forEach(vehicle ->
                        results.add(
                                new SearchResultResponse(
                                        "VEHICLE",
                                        vehicle.getId(),
                                        vehicle.getVehicleNumber(),
                                        vehicle.getManufacturer()
                                                + " "
                                                + vehicle.getModel()
                                )
                        )
                );

        routeRepository
                .findByRouteNameContainingIgnoreCaseOrSourceContainingIgnoreCaseOrDestinationContainingIgnoreCase(
                        normalizedQuery,
                        normalizedQuery,
                        normalizedQuery,
                        pageable
                )
                .forEach(route ->
                        results.add(
                                new SearchResultResponse(
                                        "ROUTE",
                                        route.getId(),
                                        route.getRouteName(),
                                        route.getSource()
                                                + " → "
                                                + route.getDestination()
                                )
                        )
                );

        stopRepository
                .findByStopNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
                        normalizedQuery,
                        normalizedQuery,
                        pageable
                )
                .forEach(stop ->
                        results.add(
                                new SearchResultResponse(
                                        "STOP",
                                        stop.getId(),
                                        stop.getStopName(),
                                        stop.getAddress()
                                )
                        )
                );

        return results;
    }

    private String normalizeQuery(
            String query
    ) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Search query cannot be empty"
            );
        }

        return query.trim();
    }
}