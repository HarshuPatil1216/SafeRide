package com.saferide.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saferide.dto.CreateStudentRequest;
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
class StudentIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createStudent_shouldReturnForbidden_WhenNoToken() throws Exception {

        CreateStudentRequest request = new CreateStudentRequest();
        request.setFullName("Integration Test Student");
        request.setRollNumber("INT001");
        request.setStandard("5");
        request.setDivision("A");
        request.setParentName("Integration Parent");
        request.setParentPhone("9999999998");
        request.setAddress("Pune");
        request.setActive(true);

        mockMvc.perform(
                        post("/api/students")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isForbidden());
    }
}