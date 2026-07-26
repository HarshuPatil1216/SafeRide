package com.saferide.serviceimpl;

import com.saferide.dto.CreateNotificationRequest;
import com.saferide.dto.NotificationResponse;
import com.saferide.entity.Notification;
import com.saferide.entity.Parent;
import com.saferide.entity.Ride;
import com.saferide.entity.Student;
import com.saferide.enums.NotificationType;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.NotificationRepository;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RideRepository;
import com.saferide.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private RideRepository rideRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private CreateNotificationRequest request;
    private Parent parent;
    private Student student;
    private Ride ride;
    private Notification notification;

    @BeforeEach
    void setUp() {

        parent = new Parent();
        parent.setId(1L);
        parent.setFullName("Suresh Patil");
        parent.setEmail("suresh@gmail.com");
        parent.setPhone("9876543211");
        parent.setAddress("Pune");
        parent.setActive(true);

        student = new Student();
        student.setId(1L);
        student.setFullName("Aarav Suresh Patil");
        student.setRollNumber("STD001");
        student.setStandard("6");
        student.setDivision("B");
        student.setParent(parent);
        student.setAddress("Pune City");
        student.setActive(true);

        ride = new Ride();
        ride.setId(2L);

        request = new CreateNotificationRequest();
        request.setParentId(1L);
        request.setStudentId(1L);
        request.setRideId(2L);
        request.setType(NotificationType.STUDENT_PICKED_UP);
        request.setTitle("Student Picked Up");
        request.setMessage(
                "Aarav Suresh Patil has been picked up successfully."
        );

        notification = new Notification();
        notification.setId(1L);
        notification.setParent(parent);
        notification.setStudent(student);
        notification.setRide(ride);
        notification.setType(NotificationType.STUDENT_PICKED_UP);
        notification.setTitle("Student Picked Up");
        notification.setMessage(
                "Aarav Suresh Patil has been picked up successfully."
        );
        notification.setReadStatus(false);
    }

    @Test
    void createNotification_shouldReturnNotificationResponse() {

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(rideRepository.findById(2L))
                .thenReturn(Optional.of(ride));

        when(notificationRepository.save(any(Notification.class)))
                .thenReturn(notification);

        NotificationResponse response =
                notificationService.createNotification(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getParentId());
        assertEquals("Suresh Patil", response.getParentName());
        assertEquals(1L, response.getStudentId());
        assertEquals(
                "Aarav Suresh Patil",
                response.getStudentName()
        );
        assertEquals(2L, response.getRideId());
        assertEquals(
                NotificationType.STUDENT_PICKED_UP,
                response.getType()
        );
        assertFalse(response.getReadStatus());

        verify(notificationRepository)
                .save(any(Notification.class));
    }

    @Test
    void createNotification_shouldWorkWithoutStudentAndRide() {

        request.setStudentId(null);
        request.setRideId(null);
        request.setType(NotificationType.GENERAL);
        request.setTitle("General Notice");
        request.setMessage("School transport notice.");

        notification.setStudent(null);
        notification.setRide(null);
        notification.setType(NotificationType.GENERAL);
        notification.setTitle("General Notice");
        notification.setMessage("School transport notice.");

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(notificationRepository.save(any(Notification.class)))
                .thenReturn(notification);

        NotificationResponse response =
                notificationService.createNotification(request);

        assertNotNull(response);
        assertNull(response.getStudentId());
        assertNull(response.getStudentName());
        assertNull(response.getRideId());

        verify(studentRepository, never())
                .findById(anyLong());

        verify(rideRepository, never())
                .findById(anyLong());
    }

    @Test
    void createNotification_shouldThrowWhenParentNotFound() {

        when(parentRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setParentId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> notificationService
                                .createNotification(request)
                );

        assertEquals(
                "Parent not found",
                exception.getMessage()
        );

        verify(notificationRepository, never())
                .save(any(Notification.class));
    }

    @Test
    void createNotification_shouldThrowWhenStudentNotFound() {

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(studentRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setStudentId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> notificationService
                                .createNotification(request)
                );

        assertEquals(
                "Student not found",
                exception.getMessage()
        );

        verify(rideRepository, never())
                .findById(anyLong());

        verify(notificationRepository, never())
                .save(any(Notification.class));
    }

    @Test
    void createNotification_shouldThrowWhenStudentDoesNotBelongToParent() {

        Parent anotherParent = new Parent();
        anotherParent.setId(99L);
        anotherParent.setFullName("Another Parent");

        student.setParent(anotherParent);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(rideRepository.findById(2L))
                .thenReturn(Optional.of(ride));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> notificationService
                                .createNotification(request)
                );

        assertEquals(
                "Student does not belong to selected parent",
                exception.getMessage()
        );

        verify(notificationRepository, never())
                .save(any(Notification.class));
    }

    @Test
    void getNotificationById_shouldReturnResponse() {

        when(notificationRepository.findById(1L))
                .thenReturn(Optional.of(notification));

        NotificationResponse response =
                notificationService.getNotificationById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(
                NotificationType.STUDENT_PICKED_UP,
                response.getType()
        );
    }

    @Test
    void markAsRead_shouldUpdateReadStatus() {

        when(notificationRepository.findById(1L))
                .thenReturn(Optional.of(notification));

        when(notificationRepository.save(notification))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        NotificationResponse response =
                notificationService.markAsRead(1L);

        assertTrue(response.getReadStatus());
        assertTrue(notification.getReadStatus());

        verify(notificationRepository)
                .save(notification);
    }

    @Test
    void getNotificationsByParent_shouldReturnPagedResponse() {

        Page<Notification> page =
                new PageImpl<>(List.of(notification));

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(notificationRepository
                .findByParentIdOrderByCreatedAtDesc(
                        eq(1L),
                        any(Pageable.class)
                ))
                .thenReturn(page);

        Page<NotificationResponse> response =
                notificationService
                        .getNotificationsByParent(
                                1L,
                                0,
                                10
                        );

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
    }

    @Test
    void getUnreadNotificationCount_shouldReturnCount() {

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(notificationRepository
                .countByParentIdAndReadStatus(
                        1L,
                        false
                ))
                .thenReturn(3L);

        long count =
                notificationService
                        .getUnreadNotificationCount(1L);

        assertEquals(3L, count);
    }

    @Test
    void deleteNotification_shouldDeleteExistingNotification() {

        when(notificationRepository.findById(1L))
                .thenReturn(Optional.of(notification));

        notificationService.deleteNotification(1L);

        verify(notificationRepository)
                .delete(notification);
    }
}