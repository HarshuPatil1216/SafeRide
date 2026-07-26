package com.saferide.service;

import com.saferide.dto.CreateNotificationRequest;
import com.saferide.dto.NotificationResponse;
import org.springframework.data.domain.Page;

public interface NotificationService {

    NotificationResponse createNotification(
            CreateNotificationRequest request
    );

    NotificationResponse getNotificationById(
            Long id
    );

    Page<NotificationResponse> getNotificationsByParent(
            Long parentId,
            int page,
            int size
    );

    Page<NotificationResponse> getUnreadNotificationsByParent(
            Long parentId,
            int page,
            int size
    );

    long getUnreadNotificationCount(
            Long parentId
    );

    NotificationResponse markAsRead(
            Long id
    );

    void deleteNotification(
            Long id
    );
}