package com.saferide.service;

import com.saferide.dto.RideResponse;
import com.saferide.dto.StudentAttendanceReportResponse;
import com.saferide.dto.VehicleLocationReportResponse;
import com.saferide.enums.StudentRideEventType;

import java.util.List;

public interface ReportService {

    List<RideResponse> getAllRides();

    List<RideResponse> getCompletedRides();

    List<RideResponse> getRunningRides();

    List<RideResponse> getScheduledRides();

    List<StudentAttendanceReportResponse> getAllAttendanceEvents();

    List<StudentAttendanceReportResponse> getAttendanceEventsByType(
            StudentRideEventType eventType
    );

    List<VehicleLocationReportResponse> getAllVehicleLocations();

    List<VehicleLocationReportResponse> getVehicleLocationReport(
            Long vehicleId
    );
}