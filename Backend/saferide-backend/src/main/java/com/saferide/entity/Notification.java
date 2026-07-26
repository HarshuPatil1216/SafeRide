package com.saferide.entity;

import com.saferide.enums.NotificationType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "notifications",
        indexes = {
                @Index(
                        name = "idx_notification_parent_id",
                        columnList = "parent_id"
                ),
                @Index(
                        name = "idx_notification_student_id",
                        columnList = "student_id"
                ),
                @Index(
                        name = "idx_notification_created_at",
                        columnList = "created_at"
                )
        }
)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "parent_id",
            nullable = false
    )
    private Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id")
    private Ride ride;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 40
    )
    private NotificationType type;

    @Column(
            nullable = false,
            length = 150
    )
    private String title;

    @Column(
            nullable = false,
            length = 1000
    )
    private String message;

    @Column(nullable = false)
    private Boolean readStatus = false;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (readStatus == null) {
            readStatus = false;
        }
    }

    public Notification() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Ride getRide() {
        return ride;
    }

    public void setRide(Ride ride) {
        this.ride = ride;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getReadStatus() {
        return readStatus;
    }

    public void setReadStatus(Boolean readStatus) {
        this.readStatus = readStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}