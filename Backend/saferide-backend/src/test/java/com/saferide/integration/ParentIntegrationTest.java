package com.saferide.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saferide.dto.CreateParentRequest;
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
class ParentIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createParent_shouldReturnForbidden_WhenNoToken() throws Exception {

        CreateParentRequest request = new CreateParentRequest();
        request.setFullName("Integration Parent");
        request.setEmail("integration.parent@gmail.com");
        request.setPhone("9999999997");
        request.setAddress("Pune");
        request.setActive(true);

        mockMvc.perform(
                        post("/api/parents")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isForbidden());
    }
}