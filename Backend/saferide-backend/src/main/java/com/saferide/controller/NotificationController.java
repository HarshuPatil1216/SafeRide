package com.saferide.controller;

import com.saferide.dto.CreateNotificationRequest;
import com.saferide.dto.NotificationResponse;
import com.saferide.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@Validated
@Tag(
        name = "Notification Management",
        description = "APIs for creating, viewing, reading and deleting parent notifications"
)
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    @Operation(
            summary = "Create notification",
            description = "Creates a notification for a parent and optionally links it to a student and ride"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Notification created successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid notification data or student-parent relationship"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Parent, student or ride not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody CreateNotificationRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        notificationService.createNotification(request)
                );
    }

    @Operation(
            summary = "Get notification by ID",
            description = "Returns the notification matching the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Notification returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Notification not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_PARENT')"
    )
    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                notificationService.getNotificationById(id)
        );
    }

    @Operation(
            summary = "Get parent notifications",
            description = "Returns paginated notifications for a parent"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Parent notifications returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Parent not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_PARENT')"
    )
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<Page<NotificationResponse>>
    getNotificationsByParent(
            @PathVariable Long parentId,

            @RequestParam(defaultValue = "0")
            @Min(
                    value = 0,
                    message = "Page number cannot be negative"
            )
            int page,

            @RequestParam(defaultValue = "20")
            @Min(
                    value = 1,
                    message = "Page size must be at least 1"
            )
            @Max(
                    value = 100,
                    message = "Page size cannot exceed 100"
            )
            int size
    ) {
        return ResponseEntity.ok(
                notificationService.getNotificationsByParent(
                        parentId,
                        page,
                        size
                )
        );
    }

    @Operation(
            summary = "Get unread parent notifications",
            description = "Returns paginated unread notifications for a parent"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Unread notifications returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Parent not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_PARENT')"
    )
    @GetMapping("/parent/{parentId}/unread")
    public ResponseEntity<Page<NotificationResponse>>
    getUnreadNotificationsByParent(
            @PathVariable Long parentId,

            @RequestParam(defaultValue = "0")
            @Min(
                    value = 0,
                    message = "Page number cannot be negative"
            )
            int page,

            @RequestParam(defaultValue = "20")
            @Min(
                    value = 1,
                    message = "Page size must be at least 1"
            )
            @Max(
                    value = 100,
                    message = "Page size cannot exceed 100"
            )
            int size
    ) {
        return ResponseEntity.ok(
                notificationService.getUnreadNotificationsByParent(
                        parentId,
                        page,
                        size
                )
        );
    }

    @Operation(
            summary = "Get unread notification count",
            description = "Returns the total unread notification count for a parent"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Unread notification count returned successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Parent not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_PARENT')"
    )
    @GetMapping("/parent/{parentId}/unread/count")
    public ResponseEntity<Long> getUnreadNotificationCount(
            @PathVariable Long parentId
    ) {
        return ResponseEntity.ok(
                notificationService.getUnreadNotificationCount(
                        parentId
                )
        );
    }

    @Operation(
            summary = "Mark notification as read",
            description = "Marks the notification matching the provided ID as read"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Notification marked as read successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Notification not found"
    )
    @PreAuthorize(
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_PARENT')"
    )
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }

    @Operation(
            summary = "Delete notification",
            description = "Deletes the notification matching the provided ID"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Notification deleted successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Notification not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id
    ) {
        notificationService.deleteNotification(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}