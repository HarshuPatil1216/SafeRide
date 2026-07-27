package com.saferide.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReportIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllRideReports_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/rides")
        ).andExpect(status().isForbidden());
    }

    @Test
    void getCompletedRideReports_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/rides/completed")
        ).andExpect(status().isForbidden());
    }

    @Test
    void getRunningRideReports_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/rides/running")
        ).andExpect(status().isForbidden());
    }

    @Test
    void getScheduledRideReports_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/rides/scheduled")
        ).andExpect(status().isForbidden());
    }

    @Test
    void getAttendanceReports_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/attendance")
        ).andExpect(status().isForbidden());
    }

    @Test
    void getPickupAttendanceReport_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/attendance/type")
                        .param("eventType", "PICKED_UP")
        ).andExpect(status().isForbidden());
    }

    @Test
    void getDropAttendanceReport_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/attendance/type")
                        .param("eventType", "DROPPED_OFF")
        ).andExpect(status().isForbidden());
    }

    @Test
    void getVehicleLocationReports_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/vehicle-locations")
        ).andExpect(status().isForbidden());
    }

    @Test
    void getVehicleLocationReportByVehicle_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                get("/api/reports/vehicle-locations/3")
        ).andExpect(status().isForbidden());
    }
}