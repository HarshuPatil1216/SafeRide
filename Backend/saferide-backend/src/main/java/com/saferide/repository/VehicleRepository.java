package com.saferide.repository;

import com.saferide.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    boolean existsByVehicleNumber(String vehicleNumber);

    Page<Vehicle> findByVehicleNumberContainingIgnoreCaseOrModelContainingIgnoreCaseOrManufacturerContainingIgnoreCase(
            String vehicleNumber,
            String model,
            String manufacturer,
            Pageable pageable
    );
}