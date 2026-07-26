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
class DashboardIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getDashboard_shouldReturnForbidden_WhenNoToken()
            throws Exception {

        mockMvc.perform(
                        get("/api/dashboard")
                )
                .andExpect(status().isForbidden());
    }
}