package com.saferide.repository;

import com.saferide.entity.Ride;
import com.saferide.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    long countByStatus(RideStatus status);

    List<Ride> findByStatus(RideStatus status);
}