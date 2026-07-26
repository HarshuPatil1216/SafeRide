package com.saferide.serviceimpl;

import com.saferide.dto.SearchResultResponse;
import com.saferide.entity.Driver;
import com.saferide.entity.Parent;
import com.saferide.entity.Route;
import com.saferide.entity.Stop;
import com.saferide.entity.Student;
import com.saferide.entity.Vehicle;
import com.saferide.repository.DriverRepository;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private StopRepository stopRepository;

    @InjectMocks
    private SearchServiceImpl searchService;

    private Student student;
    private Parent parent;
    private Driver driver;
    private Vehicle vehicle;
    private Route route;
    private Stop stop;

    @BeforeEach
    void setUp() {

        student = new Student();
        student.setId(1L);
        student.setFullName("Aarav Suresh Patil");
        student.setRollNumber("STD001");

        parent = new Parent();
        parent.setId(2L);
        parent.setFullName("Suresh Patil");
        parent.setPhone("9876543211");

        driver = new Driver();
        driver.setId(3L);
        driver.setFullName("Ramesh Patil");
        driver.setEmail("ramesh@gmail.com");

        vehicle = new Vehicle();
        vehicle.setId(4L);
        vehicle.setVehicleNumber("MH12AB1234");
        vehicle.setManufacturer("Tata");
        vehicle.setModel("Starbus");

        route = new Route();
        route.setId(5L);
        route.setRouteName("Pune School Route");
        route.setSource("Pune Station");
        route.setDestination("SafeRide School");

        stop = new Stop();
        stop.setId(6L);
        stop.setStopName("Shivajinagar");
        stop.setAddress("Shivajinagar, Pune");
    }

    @Test
    void search_shouldReturnCombinedResults() {

        when(studentRepository
                .findByFullNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(
                        eq("Pune"),
                        eq("Pune"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of(student)));

        when(parentRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                        eq("Pune"),
                        eq("Pune"),
                        eq("Pune"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of(parent)));

        when(driverRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        eq("Pune"),
                        eq("Pune"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of(driver)));

        when(vehicleRepository
                .findByVehicleNumberContainingIgnoreCaseOrModelContainingIgnoreCaseOrManufacturerContainingIgnoreCase(
                        eq("Pune"),
                        eq("Pune"),
                        eq("Pune"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of(vehicle)));

        when(routeRepository
                .findByRouteNameContainingIgnoreCaseOrSourceContainingIgnoreCaseOrDestinationContainingIgnoreCase(
                        eq("Pune"),
                        eq("Pune"),
                        eq("Pune"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of(route)));

        when(stopRepository
                .findByStopNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
                        eq("Pune"),
                        eq("Pune"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of(stop)));

        List<SearchResultResponse> results =
                searchService.search("  Pune  ");

        assertNotNull(results);
        assertEquals(6, results.size());

        assertEquals("STUDENT", results.get(0).getType());
        assertEquals("PARENT", results.get(1).getType());
        assertEquals("DRIVER", results.get(2).getType());
        assertEquals("VEHICLE", results.get(3).getType());
        assertEquals("ROUTE", results.get(4).getType());
        assertEquals("STOP", results.get(5).getType());

        assertEquals(
                "Aarav Suresh Patil",
                results.get(0).getTitle()
        );

        assertEquals(
                "MH12AB1234",
                results.get(3).getTitle()
        );

        assertEquals(
                "Pune Station → SafeRide School",
                results.get(4).getSubtitle()
        );
    }

    @Test
    void search_shouldReturnEmptyList_WhenNoMatchesFound() {

        when(studentRepository
                .findByFullNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(
                        eq("Unknown"),
                        eq("Unknown"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of()));

        when(parentRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                        eq("Unknown"),
                        eq("Unknown"),
                        eq("Unknown"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of()));

        when(driverRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        eq("Unknown"),
                        eq("Unknown"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of()));

        when(vehicleRepository
                .findByVehicleNumberContainingIgnoreCaseOrModelContainingIgnoreCaseOrManufacturerContainingIgnoreCase(
                        eq("Unknown"),
                        eq("Unknown"),
                        eq("Unknown"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of()));

        when(routeRepository
                .findByRouteNameContainingIgnoreCaseOrSourceContainingIgnoreCaseOrDestinationContainingIgnoreCase(
                        eq("Unknown"),
                        eq("Unknown"),
                        eq("Unknown"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of()));

        when(stopRepository
                .findByStopNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
                        eq("Unknown"),
                        eq("Unknown"),
                        any(Pageable.class)
                ))
                .thenReturn(new PageImpl<>(List.of()));

        List<SearchResultResponse> results =
                searchService.search("Unknown");

        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    void search_shouldThrow_WhenQueryIsBlank() {

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> searchService.search("   ")
                );

        assertEquals(
                "Search query cannot be empty",
                exception.getMessage()
        );

        verifyNoInteractions(
                studentRepository,
                parentRepository,
                driverRepository,
                vehicleRepository,
                routeRepository,
                stopRepository
        );
    }

    @Test
    void search_shouldThrow_WhenQueryIsNull() {

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> searchService.search(null)
                );

        assertEquals(
                "Search query cannot be empty",
                exception.getMessage()
        );

        verifyNoInteractions(
                studentRepository,
                parentRepository,
                driverRepository,
                vehicleRepository,
                routeRepository,
                stopRepository
        );
    }
}