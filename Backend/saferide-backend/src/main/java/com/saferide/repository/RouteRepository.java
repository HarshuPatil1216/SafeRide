package com.saferide.repository;

import com.saferide.entity.Route;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, Long> {

    boolean existsByRouteName(String routeName);

    Page<Route> findByRouteNameContainingIgnoreCaseOrSourceContainingIgnoreCaseOrDestinationContainingIgnoreCase(
            String routeName,
            String source,
            String destination,
            Pageable pageable
    );
}