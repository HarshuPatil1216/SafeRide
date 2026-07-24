package com.saferide.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saferide.dto.CreateDriverRequest;
import com.saferide.enums.DriverStatus;
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
class DriverIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createDriver_shouldReturnForbidden_WhenNoToken() throws Exception {

        CreateDriverRequest request = new CreateDriverRequest();
        request.setFullName("Test Driver");
        request.setEmail("testdriver@gmail.com");
        request.setPhone("9999999999");
        request.setLicenseNumber("TEST123456");
        request.setExperience(5);
        request.setStatus(DriverStatus.ACTIVE);

        mockMvc.perform(
                        post("/api/drivers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isForbidden());
    }
}