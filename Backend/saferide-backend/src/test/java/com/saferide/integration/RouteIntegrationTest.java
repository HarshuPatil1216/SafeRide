package com.saferide.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saferide.dto.CreateRouteRequest;
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
class RouteIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createRoute_shouldReturnForbidden_WhenNoToken() throws Exception {

        CreateRouteRequest request = new CreateRouteRequest();
        request.setRouteName("Integration Route");
        request.setSource("Pune");
        request.setDestination("Mumbai");
        request.setDistanceInKm(150.0);
        request.setEstimatedDurationInMinutes(210);
        request.setActive(true);

        mockMvc.perform(
                        post("/api/routes")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isForbidden());
    }
}