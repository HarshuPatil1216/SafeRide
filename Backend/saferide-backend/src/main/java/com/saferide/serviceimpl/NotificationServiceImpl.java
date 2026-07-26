package com.saferide.serviceimpl;

import com.saferide.dto.CreateNotificationRequest;
import com.saferide.dto.NotificationResponse;
import com.saferide.entity.Notification;
import com.saferide.entity.Parent;
import com.saferide.entity.Ride;
import com.saferide.entity.Student;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.NotificationRepository;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final RideRepository rideRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            ParentRepository parentRepository,
            StudentRepository studentRepository,
            RideRepository rideRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
        this.rideRepository = rideRepository;
    }

    @Override
    @Transactional
    public NotificationResponse createNotification(
            CreateNotificationRequest request
    ) {

        Parent parent = findParentById(
                request.getParentId()
        );

        Student student = findOptionalStudentById(
                request.getStudentId()
        );

        Ride ride = findOptionalRideById(
                request.getRideId()
        );

        validateStudentBelongsToParent(
                student,
                parent
        );

        Notification notification = new Notification();

        notification.setParent(parent);
        notification.setStudent(student);
        notification.setRide(ride);
        notification.setType(request.getType());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setReadStatus(false);

        Notification savedNotification =
                notificationRepository.save(notification);

        return mapToResponse(savedNotification);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(
            Long id
    ) {
        return mapToResponse(
                findNotificationById(id)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsByParent(
            Long parentId,
            int page,
            int size
    ) {

        findParentById(parentId);

        Pageable pageable = PageRequest.of(
                page,
                size
        );

        return notificationRepository
                .findByParentIdOrderByCreatedAtDesc(
                        parentId,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse>
    getUnreadNotificationsByParent(
            Long parentId,
            int page,
            int size
    ) {

        findParentById(parentId);

        Pageable pageable = PageRequest.of(
                page,
                size
        );

        return notificationRepository
                .findByParentIdAndReadStatusOrderByCreatedAtDesc(
                        parentId,
                        false,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(
            Long parentId
    ) {

        findParentById(parentId);

        return notificationRepository
                .countByParentIdAndReadStatus(
                        parentId,
                        false
                );
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(
            Long id
    ) {

        Notification notification =
                findNotificationById(id);

        notification.setReadStatus(true);

        Notification updatedNotification =
                notificationRepository.save(notification);

        return mapToResponse(updatedNotification);
    }

    @Override
    @Transactional
    public void deleteNotification(
            Long id
    ) {

        Notification notification =
                findNotificationById(id);

        notificationRepository.delete(notification);
    }

    private Notification findNotificationById(
            Long id
    ) {

        return notificationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found"
                        )
                );
    }

    private Parent findParentById(
            Long id
    ) {

        return parentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parent not found"
                        )
                );
    }

    private Student findOptionalStudentById(
            Long id
    ) {

        if (id == null) {
            return null;
        }

        return studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found"
                        )
                );
    }

    private Ride findOptionalRideById(
            Long id
    ) {

        if (id == null) {
            return null;
        }

        return rideRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ride not found"
                        )
                );
    }

    private void validateStudentBelongsToParent(
            Student student,
            Parent parent
    ) {

        if (student == null) {
            return;
        }

        if (student.getParent() == null
                || !student.getParent().getId()
                .equals(parent.getId())) {

            throw new IllegalArgumentException(
                    "Student does not belong to selected parent"
            );
        }
    }

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        Parent parent = notification.getParent();
        Student student = notification.getStudent();
        Ride ride = notification.getRide();

        return new NotificationResponse(
                notification.getId(),

                parent.getId(),
                parent.getFullName(),

                student != null
                        ? student.getId()
                        : null,

                student != null
                        ? student.getFullName()
                        : null,

                ride != null
                        ? ride.getId()
                        : null,

                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getReadStatus(),
                notification.getCreatedAt()
        );
    }
}