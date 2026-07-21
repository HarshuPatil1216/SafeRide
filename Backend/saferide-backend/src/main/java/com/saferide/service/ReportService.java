package com.saferide.service;

import com.saferide.dto.RideResponse;

import java.util.List;

public interface ReportService {

    List<RideResponse> getCompletedRides();

    List<RideResponse> getRunningRides();

    List<RideResponse> getScheduledRides();
}