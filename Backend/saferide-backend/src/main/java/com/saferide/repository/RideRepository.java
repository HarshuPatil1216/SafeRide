package com.saferide.repository;

import com.saferide.entity.Ride;
import com.saferide.enums.RideStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    long countByStatus(RideStatus status);

    List<Ride> findByStatus(RideStatus status);

    Page<Ride> findAll(Pageable pageable);
}