package com.saferide.service;

import com.saferide.dto.CreateStopRequest;
import com.saferide.dto.StopResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface StopService {

    StopResponse createStop(
            CreateStopRequest request
    );

    Page<StopResponse> getAllStops(
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    Page<StopResponse> searchStops(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    List<StopResponse> getStopsByRouteId(
            Long routeId
    );

    StopResponse getStopById(Long id);

    StopResponse updateStop(
            Long id,
            CreateStopRequest request
    );

    void deleteStop(Long id);
}