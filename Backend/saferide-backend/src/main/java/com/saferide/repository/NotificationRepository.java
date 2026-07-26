package com.saferide.repository;

import com.saferide.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    Page<Notification> findByParentIdOrderByCreatedAtDesc(
            Long parentId,
            Pageable pageable
    );

    Page<Notification> findByParentIdAndReadStatusOrderByCreatedAtDesc(
            Long parentId,
            Boolean readStatus,
            Pageable pageable
    );

    long countByParentIdAndReadStatus(
            Long parentId,
            Boolean readStatus
    );
}