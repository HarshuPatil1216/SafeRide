package com.saferide.serviceimpl;

import com.saferide.dto.CreateVehicleRequest;
import com.saferide.dto.VehicleResponse;
import com.saferide.entity.Vehicle;
import com.saferide.repository.VehicleRepository;
import com.saferide.service.VehicleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(
            VehicleRepository vehicleRepository
    ) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleResponse createVehicle(
            CreateVehicleRequest request
    ) {

        if (vehicleRepository.existsByVehicleNumber(
                request.getVehicleNumber()
        )) {
            throw new RuntimeException(
                    "Vehicle number already exists"
            );
        }

        Vehicle vehicle = new Vehicle();

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setModel(request.getModel());
        vehicle.setManufacturer(request.getManufacturer());
        vehicle.setStatus(request.getStatus());

        Vehicle savedVehicle =
                vehicleRepository.save(vehicle);

        return mapToResponse(savedVehicle);
    }

    @Override
    public Page<VehicleResponse> getAllVehicles(
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {

        Sort sort = createSort(
                sortBy,
                sortDir
        );

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        return vehicleRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<VehicleResponse> searchVehicles(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {

        Sort sort = createSort(
                sortBy,
                sortDir
        );

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        return vehicleRepository
                .findByVehicleNumberContainingIgnoreCaseOrModelContainingIgnoreCaseOrManufacturerContainingIgnoreCase(
                        query,
                        query,
                        query,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    public VehicleResponse getVehicleById(Long id) {

        Vehicle vehicle = vehicleRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vehicle not found"
                        )
                );

        return mapToResponse(vehicle);
    }

    @Override
    public VehicleResponse updateVehicle(
            Long id,
            CreateVehicleRequest request
    ) {

        Vehicle vehicle = vehicleRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vehicle not found"
                        )
                );

        if (!vehicle.getVehicleNumber()
                .equalsIgnoreCase(
                        request.getVehicleNumber()
                )
                && vehicleRepository
                .existsByVehicleNumber(
                        request.getVehicleNumber()
                )) {

            throw new RuntimeException(
                    "Vehicle number already exists"
            );
        }

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setModel(request.getModel());
        vehicle.setManufacturer(request.getManufacturer());
        vehicle.setStatus(request.getStatus());

        Vehicle updatedVehicle =
                vehicleRepository.save(vehicle);

        return mapToResponse(updatedVehicle);
    }

    @Override
    public void deleteVehicle(Long id) {

        Vehicle vehicle = vehicleRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vehicle not found"
                        )
                );

        vehicleRepository.delete(vehicle);
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

    private VehicleResponse mapToResponse(
            Vehicle vehicle
    ) {

        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getVehicleNumber(),
                vehicle.getVehicleType(),
                vehicle.getCapacity(),
                vehicle.getModel(),
                vehicle.getManufacturer(),
                vehicle.getStatus(),
                vehicle.getCreatedAt()
        );
    }
}