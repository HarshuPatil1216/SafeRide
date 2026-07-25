package com.saferide.serviceimpl;

import com.saferide.dto.CreateStudentRideEventRequest;
import com.saferide.dto.StudentRideEventResponse;
import com.saferide.entity.Ride;
import com.saferide.entity.Route;
import com.saferide.entity.Stop;
import com.saferide.entity.Student;
import com.saferide.entity.StudentRideEvent;
import com.saferide.enums.RideStatus;
import com.saferide.enums.StudentRideEventType;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.RideRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.repository.StudentRideEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentRideEventServiceImplTest {

    @Mock
    private StudentRideEventRepository eventRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private RideRepository rideRepository;

    @Mock
    private StopRepository stopRepository;

    @InjectMocks
    private StudentRideEventServiceImpl eventService;

    private CreateStudentRideEventRequest request;
    private Student student;
    private Ride ride;
    private Route route;
    private Stop stop;
    private StudentRideEvent savedEvent;

    @BeforeEach
    void setUp() {

        route = new Route();
        route.setId(2L);
        route.setRouteName("Pune School Route");
        route.setSource("Pune Station");
        route.setDestination("SafeRide School");
        route.setDistanceInKm(12.5);
        route.setEstimatedDurationInMinutes(35);
        route.setActive(true);

        stop = new Stop();
        stop.setId(1L);
        stop.setStopName("Shivajinagar");
        stop.setAddress("Shivajinagar, Pune");
        stop.setStopOrder(1);
        stop.setEstimatedArrivalMinutes(20);
        stop.setRoute(route);
        stop.setActive(true);

        student = new Student();
        student.setId(1L);
        student.setFullName("Aarav Suresh Patil");
        student.setRollNumber("STD001");
        student.setStandard("6");
        student.setDivision("B");
        student.setRoute(route);
        student.setStop(stop);
        student.setAddress("Pune City");
        student.setActive(true);

        ride = new Ride();
        ride.setId(2L);
        ride.setStatus(RideStatus.IN_PROGRESS);

        request = new CreateStudentRideEventRequest();
        request.setStudentId(1L);
        request.setRideId(2L);
        request.setEventType(StudentRideEventType.PICKED_UP);
        request.setStopId(1L);
        request.setLatitude(18.5308);
        request.setLongitude(73.8475);
        request.setRemarks("Student picked up successfully");

        savedEvent = new StudentRideEvent();
        savedEvent.setId(1L);
        savedEvent.setStudent(student);
        savedEvent.setRide(ride);
        savedEvent.setEventType(StudentRideEventType.PICKED_UP);
        savedEvent.setStop(stop);
        savedEvent.setLatitude(18.5308);
        savedEvent.setLongitude(73.8475);
        savedEvent.setRemarks("Student picked up successfully");
        savedEvent.setEventTime(LocalDateTime.now());
    }

    @Test
    void createEvent_shouldRecordPickupSuccessfully() {

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(rideRepository.findById(2L))
                .thenReturn(Optional.of(ride));

        when(stopRepository.findById(1L))
                .thenReturn(Optional.of(stop));

        when(eventRepository
                .existsByStudentIdAndRideIdAndEventType(
                        1L,
                        2L,
                        StudentRideEventType.PICKED_UP
                ))
                .thenReturn(false);

        when(eventRepository
                .existsByStudentIdAndRideIdAndEventType(
                        1L,
                        2L,
                        StudentRideEventType.DROPPED_OFF
                ))
                .thenReturn(false);

        when(eventRepository.save(any(StudentRideEvent.class)))
                .thenReturn(savedEvent);

        StudentRideEventResponse response =
                eventService.createEvent(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getStudentId());
        assertEquals("Aarav Suresh Patil", response.getStudentName());
        assertEquals(2L, response.getRideId());
        assertEquals(
                StudentRideEventType.PICKED_UP,
                response.getEventType()
        );
        assertEquals(1L, response.getStopId());
        assertEquals("Shivajinagar", response.getStopName());

        verify(eventRepository)
                .save(any(StudentRideEvent.class));
    }

    @Test
    void createEvent_shouldThrowWhenRideIsNotInProgress() {

        ride.setStatus(RideStatus.SCHEDULED);

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(rideRepository.findById(2L))
                .thenReturn(Optional.of(ride));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> eventService.createEvent(request)
                );

        assertEquals(
                "Student pickup or drop can only be recorded for an in-progress ride",
                exception.getMessage()
        );

        verify(stopRepository, never())
                .findById(anyLong());

        verify(eventRepository, never())
                .save(any(StudentRideEvent.class));
    }

    @Test
    void createEvent_shouldThrowWhenPickupAlreadyRecorded() {

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(rideRepository.findById(2L))
                .thenReturn(Optional.of(ride));

        when(stopRepository.findById(1L))
                .thenReturn(Optional.of(stop));

        when(eventRepository
                .existsByStudentIdAndRideIdAndEventType(
                        1L,
                        2L,
                        StudentRideEventType.PICKED_UP
                ))
                .thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> eventService.createEvent(request)
                );

        assertEquals(
                "Student pickup already recorded for this ride",
                exception.getMessage()
        );

        verify(eventRepository, never())
                .save(any(StudentRideEvent.class));
    }

    @Test
    void createEvent_shouldThrowWhenDropRecordedBeforePickup() {

        request.setEventType(StudentRideEventType.DROPPED_OFF);
        request.setRemarks("Student dropped off successfully");

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(rideRepository.findById(2L))
                .thenReturn(Optional.of(ride));

        when(stopRepository.findById(1L))
                .thenReturn(Optional.of(stop));

        when(eventRepository
                .existsByStudentIdAndRideIdAndEventType(
                        1L,
                        2L,
                        StudentRideEventType.PICKED_UP
                ))
                .thenReturn(false);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> eventService.createEvent(request)
                );

        assertEquals(
                "Student must be picked up before drop-off",
                exception.getMessage()
        );

        verify(eventRepository, never())
                .save(any(StudentRideEvent.class));
    }

    @Test
    void createEvent_shouldRecordDropSuccessfully() {

        request.setEventType(StudentRideEventType.DROPPED_OFF);
        request.setRemarks("Student dropped off successfully");

        savedEvent.setId(2L);
        savedEvent.setEventType(StudentRideEventType.DROPPED_OFF);
        savedEvent.setRemarks("Student dropped off successfully");

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(rideRepository.findById(2L))
                .thenReturn(Optional.of(ride));

        when(stopRepository.findById(1L))
                .thenReturn(Optional.of(stop));

        when(eventRepository
                .existsByStudentIdAndRideIdAndEventType(
                        1L,
                        2L,
                        StudentRideEventType.PICKED_UP
                ))
                .thenReturn(true);

        when(eventRepository
                .existsByStudentIdAndRideIdAndEventType(
                        1L,
                        2L,
                        StudentRideEventType.DROPPED_OFF
                ))
                .thenReturn(false);

        when(eventRepository.save(any(StudentRideEvent.class)))
                .thenReturn(savedEvent);

        StudentRideEventResponse response =
                eventService.createEvent(request);

        assertNotNull(response);
        assertEquals(2L, response.getId());
        assertEquals(
                StudentRideEventType.DROPPED_OFF,
                response.getEventType()
        );

        verify(eventRepository)
                .save(any(StudentRideEvent.class));
    }

    @Test
    void createEvent_shouldThrowWhenStopDoesNotBelongToStudentRoute() {

        Route anotherRoute = new Route();
        anotherRoute.setId(99L);
        anotherRoute.setRouteName("Another Route");

        stop.setRoute(anotherRoute);

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(rideRepository.findById(2L))
                .thenReturn(Optional.of(ride));

        when(stopRepository.findById(1L))
                .thenReturn(Optional.of(stop));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> eventService.createEvent(request)
                );

        assertEquals(
                "Selected stop does not belong to student's route",
                exception.getMessage()
        );

        verify(eventRepository, never())
                .save(any(StudentRideEvent.class));
    }

    @Test
    void createEvent_shouldThrowWhenStudentNotFound() {

        when(studentRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setStudentId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> eventService.createEvent(request)
                );

        assertEquals(
                "Student not found",
                exception.getMessage()
        );

        verify(rideRepository, never())
                .findById(anyLong());

        verify(eventRepository, never())
                .save(any(StudentRideEvent.class));
    }
}