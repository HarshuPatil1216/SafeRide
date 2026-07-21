package com.saferide.serviceimpl;

import com.saferide.dto.CreateVehicleRequest;
import com.saferide.dto.VehicleResponse;
import com.saferide.entity.Vehicle;
import com.saferide.repository.VehicleRepository;
import com.saferide.service.VehicleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleResponse createVehicle(CreateVehicleRequest request) {

        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new RuntimeException("Vehicle number already exists");
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setModel(request.getModel());
        vehicle.setManufacturer(request.getManufacturer());
        vehicle.setStatus(request.getStatus());

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return mapToResponse(savedVehicle);
    }

    @Override
    public List<VehicleResponse> getAllVehicles() {

        return vehicleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public VehicleResponse getVehicleById(Long id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        return mapToResponse(vehicle);
    }

    @Override
    public VehicleResponse updateVehicle(
            Long id,
            CreateVehicleRequest request
    ) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        if (!vehicle.getVehicleNumber().equals(request.getVehicleNumber())
                && vehicleRepository.existsByVehicleNumber(
                request.getVehicleNumber()
        )) {
            throw new RuntimeException("Vehicle number already exists");
        }

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setModel(request.getModel());
        vehicle.setManufacturer(request.getManufacturer());
        vehicle.setStatus(request.getStatus());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);

        return mapToResponse(updatedVehicle);
    }

    @Override
    public void deleteVehicle(Long id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        vehicleRepository.delete(vehicle);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {

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