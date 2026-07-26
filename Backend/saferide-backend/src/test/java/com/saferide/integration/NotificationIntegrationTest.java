package com.saferide.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saferide.dto.CreateNotificationRequest;
import com.saferide.enums.NotificationType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class NotificationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createNotification_shouldReturnForbidden_WhenNoToken() throws Exception {

        CreateNotificationRequest request =
                new CreateNotificationRequest();

        request.setParentId(1L);
        request.setStudentId(1L);
        request.setRideId(2L);
        request.setType(NotificationType.STUDENT_PICKED_UP);
        request.setTitle("Student Picked Up");
        request.setMessage("Student has been picked up.");

        mockMvc.perform(
                        post("/api/notifications")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isForbidden());
    }
}