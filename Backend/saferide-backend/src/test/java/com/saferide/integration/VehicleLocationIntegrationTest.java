package com.saferide.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saferide.dto.UpdateVehicleLocationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class VehicleLocationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void updateLocation_shouldReturnForbidden_WhenNoToken() throws Exception {

        UpdateVehicleLocationRequest request =
                new UpdateVehicleLocationRequest();

        request.setVehicleId(3L);
        request.setLatitude(18.5204);
        request.setLongitude(73.8567);
        request.setSpeed(42.5);
        request.setHeading(90.0);

        mockMvc.perform(
                        post("/api/vehicle-locations")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isForbidden());
    }
}