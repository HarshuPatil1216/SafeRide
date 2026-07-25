package com.saferide.repository;

import com.saferide.entity.Stop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StopRepository extends JpaRepository<Stop, Long> {

    boolean existsByRouteIdAndStopNameIgnoreCase(
            Long routeId,
            String stopName
    );

    boolean existsByRouteIdAndStopOrder(
            Long routeId,
            Integer stopOrder
    );

    Page<Stop> findByStopNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
            String stopName,
            String address,
            Pageable pageable
    );

    List<Stop> findByRouteIdOrderByStopOrderAsc(
            Long routeId
    );
}