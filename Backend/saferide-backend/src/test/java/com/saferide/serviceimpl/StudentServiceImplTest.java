package com.saferide.serviceimpl;

import com.saferide.dto.CreateStudentRequest;
import com.saferide.dto.StudentResponse;
import com.saferide.entity.Parent;
import com.saferide.entity.Route;
import com.saferide.entity.Stop;
import com.saferide.entity.Student;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private StopRepository stopRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private CreateStudentRequest request;
    private Parent parent;
    private Route route;
    private Stop stop;
    private Student student;

    @BeforeEach
    void setUp() {

        request = new CreateStudentRequest();
        request.setFullName("Aarav Suresh Patil");
        request.setRollNumber("STD001");
        request.setStandard("6");
        request.setDivision("B");
        request.setParentId(1L);
        request.setRouteId(2L);
        request.setStopId(3L);
        request.setAddress("Pune City");
        request.setActive(true);

        parent = new Parent();
        parent.setId(1L);
        parent.setFullName("Suresh Patil");
        parent.setEmail("suresh.patil@gmail.com");
        parent.setPhone("9876543211");
        parent.setAddress("Pune City");
        parent.setActive(true);

        route = new Route();
        route.setId(2L);
        route.setRouteName("Pune School Route");
        route.setSource("Pune Station");
        route.setDestination("SafeRide School");
        route.setDistanceInKm(12.5);
        route.setEstimatedDurationInMinutes(35);
        route.setActive(true);

        stop = new Stop();
        stop.setId(3L);
        stop.setStopName("Shivajinagar");
        stop.setAddress("Shivajinagar, Pune");
        stop.setLatitude(18.5308);
        stop.setLongitude(73.8475);
        stop.setStopOrder(1);
        stop.setEstimatedArrivalMinutes(20);
        stop.setActive(true);
        stop.setRoute(route);

        student = new Student();
        student.setId(1L);
        student.setFullName(request.getFullName());
        student.setRollNumber(request.getRollNumber());
        student.setStandard(request.getStandard());
        student.setDivision(request.getDivision());
        student.setParent(parent);
        student.setRoute(route);
        student.setStop(stop);
        student.setAddress(request.getAddress());
        student.setActive(request.getActive());
    }

    @Test
    void createStudent_shouldReturnStudentResponse() {

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(routeRepository.findById(2L))
                .thenReturn(Optional.of(route));

        when(stopRepository.findById(3L))
                .thenReturn(Optional.of(stop));

        when(studentRepository.save(any(Student.class)))
                .thenReturn(student);

        StudentResponse response =
                studentService.createStudent(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(
                "Aarav Suresh Patil",
                response.getFullName()
        );
        assertEquals("STD001", response.getRollNumber());
        assertEquals("6", response.getStandard());
        assertEquals("B", response.getDivision());

        assertEquals(1L, response.getParentId());
        assertEquals("Suresh Patil", response.getParentName());
        assertEquals("9876543211", response.getParentPhone());

        assertEquals(2L, response.getRouteId());
        assertEquals(
                "Pune School Route",
                response.getRouteName()
        );

        assertEquals(3L, response.getStopId());
        assertEquals(
                "Shivajinagar",
                response.getStopName()
        );

        assertTrue(response.getActive());

        verify(parentRepository).findById(1L);
        verify(routeRepository).findById(2L);
        verify(stopRepository).findById(3L);
        verify(studentRepository)
                .save(any(Student.class));
    }

    @Test
    void createStudent_shouldWorkWithoutRouteAndStop() {

        request.setRouteId(null);
        request.setStopId(null);

        student.setRoute(null);
        student.setStop(null);

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(studentRepository.save(any(Student.class)))
                .thenReturn(student);

        StudentResponse response =
                studentService.createStudent(request);

        assertNotNull(response);
        assertNull(response.getRouteId());
        assertNull(response.getRouteName());
        assertNull(response.getStopId());
        assertNull(response.getStopName());

        verify(routeRepository, never())
                .findById(anyLong());

        verify(stopRepository, never())
                .findById(anyLong());
    }

    @Test
    void createStudent_shouldWorkWithRouteButWithoutStop() {

        request.setStopId(null);
        student.setStop(null);

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(routeRepository.findById(2L))
                .thenReturn(Optional.of(route));

        when(studentRepository.save(any(Student.class)))
                .thenReturn(student);

        StudentResponse response =
                studentService.createStudent(request);

        assertNotNull(response);
        assertEquals(2L, response.getRouteId());
        assertEquals(
                "Pune School Route",
                response.getRouteName()
        );
        assertNull(response.getStopId());
        assertNull(response.getStopName());

        verify(stopRepository, never())
                .findById(anyLong());
    }

    @Test
    void createStudent_shouldThrowWhenRollNumberAlreadyExists() {

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> studentService.createStudent(request)
                );

        assertEquals(
                "Student roll number already exists",
                exception.getMessage()
        );

        verify(parentRepository, never())
                .findById(anyLong());

        verify(routeRepository, never())
                .findById(anyLong());

        verify(stopRepository, never())
                .findById(anyLong());

        verify(studentRepository, never())
                .save(any(Student.class));
    }

    @Test
    void createStudent_shouldThrowWhenParentNotFound() {

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> studentService.createStudent(request)
                );

        assertEquals(
                "Parent not found",
                exception.getMessage()
        );

        verify(routeRepository, never())
                .findById(anyLong());

        verify(stopRepository, never())
                .findById(anyLong());

        verify(studentRepository, never())
                .save(any(Student.class));
    }

    @Test
    void createStudent_shouldThrowWhenRouteNotFound() {

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(routeRepository.findById(2L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> studentService.createStudent(request)
                );

        assertEquals(
                "Route not found",
                exception.getMessage()
        );

        verify(stopRepository, never())
                .findById(anyLong());

        verify(studentRepository, never())
                .save(any(Student.class));
    }

    @Test
    void createStudent_shouldThrowWhenStopNotFound() {

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(routeRepository.findById(2L))
                .thenReturn(Optional.of(route));

        when(stopRepository.findById(3L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> studentService.createStudent(request)
                );

        assertEquals(
                "Stop not found",
                exception.getMessage()
        );

        verify(studentRepository, never())
                .save(any(Student.class));
    }

    @Test
    void createStudent_shouldThrowWhenStopProvidedWithoutRoute() {

        request.setRouteId(null);

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> studentService.createStudent(request)
                );

        assertEquals(
                "Route must be selected before assigning a stop",
                exception.getMessage()
        );

        verify(stopRepository, never())
                .findById(anyLong());

        verify(studentRepository, never())
                .save(any(Student.class));
    }

    @Test
    void createStudent_shouldThrowWhenStopBelongsToDifferentRoute() {

        Route anotherRoute = new Route();
        anotherRoute.setId(99L);
        anotherRoute.setRouteName("Another Route");

        stop.setRoute(anotherRoute);

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        when(routeRepository.findById(2L))
                .thenReturn(Optional.of(route));

        when(stopRepository.findById(3L))
                .thenReturn(Optional.of(stop));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> studentService.createStudent(request)
                );

        assertEquals(
                "Selected stop does not belong to selected route",
                exception.getMessage()
        );

        verify(studentRepository, never())
                .save(any(Student.class));
    }

    @Test
    void getStudentById_shouldReturnStudentResponse() {

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        StudentResponse response =
                studentService.getStudentById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("STD001", response.getRollNumber());

        assertEquals(1L, response.getParentId());
        assertEquals("Suresh Patil", response.getParentName());

        assertEquals(2L, response.getRouteId());
        assertEquals(
                "Pune School Route",
                response.getRouteName()
        );

        assertEquals(3L, response.getStopId());
        assertEquals(
                "Shivajinagar",
                response.getStopName()
        );
    }

    @Test
    void getStudentById_shouldThrowWhenStudentNotFound() {

        when(studentRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> studentService.getStudentById(999L)
                );

        assertEquals(
                "Student not found",
                exception.getMessage()
        );
    }
}