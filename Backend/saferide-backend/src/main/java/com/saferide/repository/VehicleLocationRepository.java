package com.saferide.repository;

import com.saferide.entity.VehicleLocation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleLocationRepository
        extends JpaRepository<VehicleLocation, Long> {

    Optional<VehicleLocation>
    findTopByVehicleIdOrderByRecordedAtDesc(
            Long vehicleId
    );

    Page<VehicleLocation>
    findByVehicleIdOrderByRecordedAtDesc(
            Long vehicleId,
            Pageable pageable
    );

    List<VehicleLocation>
    findByVehicleIdOrderByRecordedAtDesc(
            Long vehicleId
    );
}